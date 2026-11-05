process.env.JWT_SECRET = "test-secret";
process.env.AWS_S3_BUCKET = "test-bucket";
process.env.AWS_REGION = "eu-north-1";

const mockSend = jest.fn();
const mockUploadDone = jest.fn();

jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));
jest.mock("@aws-sdk/lib-storage", () => ({
  Upload: jest.fn().mockImplementation(() => ({ done: mockUploadDone })),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const app = require("../index");

const tokenFor = (role) =>
  jwt.sign({ id: 1, role, email: "t@example.com" }, "test-secret", { expiresIn: "1h" });

const BASE = "https://test-bucket.s3.eu-north-1.amazonaws.com/";

beforeAll(() => {
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  pool.query.mockReset();
  mockSend.mockReset();
  mockUploadDone.mockReset();
  DeleteObjectCommand.mockClear();
});

describe("POST /api/vehicles/:id/image", () => {
  test("401 without a token", async () => {
    const res = await request(app).post("/api/vehicles/3/image");
    expect(res.status).toBe(401);
  });

  test("403 for a normal user", async () => {
    const res = await request(app)
      .post("/api/vehicles/3/image")
      .set("Authorization", `Bearer ${tokenFor("user")}`)
      .attach("image", Buffer.from("fake"), "car.jpg");
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Only admin can upload images");
    expect(mockUploadDone).not.toHaveBeenCalled();
  });

  test("400 when no file is sent", async () => {
    const res = await request(app)
      .post("/api/vehicles/3/image")
      .set("Authorization", `Bearer ${tokenFor("admin")}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No image file provided");
  });

  test("200 for an admin: uploads to S3 and saves the URL", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 99, vehicleid: 3, imagepath: `${BASE}vehicles/3/1-car.jpg`, ismainimage: false }],
    });

    const res = await request(app)
      .post("/api/vehicles/3/image")
      .set("Authorization", `Bearer ${tokenFor("admin")}`)
      .attach("image", Buffer.from("fake"), "car.jpg");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Image uploaded successfully");
    expect(mockUploadDone).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO vehicle_images"),
      ["3", expect.stringMatching(/^https:\/\/test-bucket\.s3\.eu-north-1\.amazonaws\.com\/vehicles\/3\/\d+-car\.jpg$/)]
    );
  });
});

describe("DELETE /api/vehicles/:id/image/:imageId", () => {
  test("401 without a token", async () => {
    const res = await request(app).delete("/api/vehicles/3/image/5");
    expect(res.status).toBe(401);
  });

  test("403 for a normal user", async () => {
    const res = await request(app)
      .delete("/api/vehicles/3/image/5")
      .set("Authorization", `Bearer ${tokenFor("user")}`);
    expect(res.status).toBe(403);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("404 when the image does not exist", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .delete("/api/vehicles/3/image/5")
      .set("Authorization", `Bearer ${tokenFor("admin")}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Image not found");
    expect(mockSend).not.toHaveBeenCalled();
  });

  test("200 for an S3 image: deletes the file, then the row", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 5, vehicleid: 3, imagepath: `${BASE}vehicles/3/123-car.jpg` }] })
      .mockResolvedValueOnce({});

    const res = await request(app)
      .delete("/api/vehicles/3/image/5")
      .set("Authorization", `Bearer ${tokenFor("admin")}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Image deleted successfully");
    expect(DeleteObjectCommand).toHaveBeenCalledWith({ Bucket: "test-bucket", Key: "vehicles/3/123-car.jpg" });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenLastCalledWith(
      expect.stringContaining("DELETE FROM vehicle_images"),
      ["5"]
    );
  });

  test("200 for an external image: skips S3, still deletes the row", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 4, vehicleid: 3, imagepath: "https://m.atcdn.co.uk/a/media/x.jpg" }] })
      .mockResolvedValueOnce({});

    const res = await request(app)
      .delete("/api/vehicles/3/image/4")
      .set("Authorization", `Bearer ${tokenFor("root")}`);

    expect(res.status).toBe(200);
    expect(mockSend).not.toHaveBeenCalled();
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

    test("500 when the S3 upload fails: nothing is saved in the database", async () => {
    mockUploadDone.mockRejectedValueOnce(new Error("S3 down"));

    const res = await request(app)
      .post("/api/vehicles/3/image")
      .set("Authorization", `Bearer ${tokenFor("admin")}`)
      .attach("image", Buffer.from("fake"), "car.jpg");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("S3 down");
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("500 when S3 fails: the database row is NOT deleted", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, vehicleid: 3, imagepath: `${BASE}vehicles/3/123-car.jpg` }] });
    mockSend.mockRejectedValueOnce(new Error("S3 down"));

    const res = await request(app)
      .delete("/api/vehicles/3/image/5")
      .set("Authorization", `Bearer ${tokenFor("admin")}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("S3 down");
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});


