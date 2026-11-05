process.env.JWT_SECRET = "test-secret";
process.env.AWS_S3_BUCKET = "test-bucket";
process.env.AWS_REGION = "eu-north-1";

const mockSend = jest.fn();
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

jest.mock("../db",() =>({query:jest.fn()}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const app = require("../index");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const BASE = "https://test-bucket.s3.eu-north-1.amazonaws.com/";

const auth =(role) => ({
    Authorization : `Bearer ${jwt.sign({id:1, role, email:"test-user@example.com"}, "test-secret",{expiresIn: "1h"})}`,
});

const vehicle = {
  summary: "2017 Audi A3", description: "One owner", make: 1, model: "A3",
  status: 1, gearbox_type: 1, fuel_type: 1, body_type: 1,
  mileage: 10000, price: 15000, no_of_seats: 5, no_of_doors: 3,
  first_registration_year: 2017,
};

beforeAll (() =>{
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  pool.query.mockReset();
  mockSend.mockReset();
  DeleteObjectCommand.mockClear();
});

describe("POST /api/vehicles", () => {
    test("401 without a token", async () => {
        const res = await request(app).post("/api/vehicles").send(vehicle);
        expect(res.status).toBe(401);
    });

    test("403 for a normal user", async () => {
        const res = await request(app)
        .post("/api/vehicles")
        .set(auth("user"))
        .send(vehicle);
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Only admin can add listings");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test.each(["admin", "root"])("200 for %s: inserts the vehicle", async (role) => {
        pool.query.mockResolvedValueOnce({rows:[{id:7, ...vehicle}]});

        const res = await request(app)
        .post("/api/vehicles")
        .set(auth(role))
        .send(vehicle);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Vehicle created successfully");
        expect(res.body.vehicle.id).toBe(7);
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO vehicle"),
             [
        vehicle.summary, vehicle.description, vehicle.make, vehicle.model,
        vehicle.status, vehicle.gearbox_type, vehicle.fuel_type, vehicle.body_type,
        vehicle.mileage, vehicle.price, vehicle.no_of_seats, vehicle.no_of_doors,
        vehicle.first_registration_year,
      ]
    );
    });
    test("500 when the database fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("db down"));
        const res = await request(app)
        .post("/api/vehicles")
        .set(auth("admin"))
        .send(vehicle);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("db down");
    });
});
describe("PUT /api/vehicles/:id", () => {
    test("401 without a token", async () => {
        const res = await request(app).put("/api/vehicles/7").send(vehicle);
        expect(res.status).toBe(401);
    });

    test("403 for a normal user", async () => {
        const res = await request(app)
        .put("/api/vehicles/7")
        .set(auth("user"))
        .send(vehicle);
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Only admin can edit listings");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("404 when the vehicle does not exist", async () => {
        pool.query.mockResolvedValueOnce({rows:[]});
        const res = await request(app)
        .put("/api/vehicles/999")
        .set(auth("admin"))
        .send(vehicle);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Vehicle not found");
    });

    test.each(["admin", "root"])("200 for %s: updates the vehicle", async (role) => {
        pool.query.mockResolvedValueOnce({rows:[{id:7, ...vehicle}]});

        const res = await request(app)
        .put("/api/vehicles/7")
        .set(auth(role))
        .send(vehicle);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Vehicle updated successfully");
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE vehicle"),
             [
                vehicle.summary, vehicle.description, vehicle.make, vehicle.model,
        vehicle.status, vehicle.gearbox_type, vehicle.fuel_type, vehicle.body_type,
        vehicle.mileage, vehicle.price, "7",
      ]
        );
    });
    test("500 when the database fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("db down"));
        const res = await request(app)
        .put("/api/vehicles/7")
        .set(auth("admin"))
        .send(vehicle);
        expect(res.status).toBe(500);
    });
});

describe("DELETE /api/vehicles/:id", () => {
  test("401 without a token", async () => {
    const res = await request(app).delete("/api/vehicles/7");
    expect(res.status).toBe(401);
  });

  test("403 for a normal user", async () => {
    const res = await request(app).delete("/api/vehicles/7").set(auth("user"));
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Only admins can delete listings");
    expect(pool.query).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  test("404 when the vehicle does not exist", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete("/api/vehicles/999").set(auth("admin"));
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Vehicle not found");
  });

  test.each(["admin", "root"])("200 for %s: removes S3 files, image rows, then the vehicle", async (role) => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ imagepath: `${BASE}vehicles/7/1-a.jpg` }, { imagepath: "https://m.atcdn.co.uk/x.jpg" }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 7 }] });

    const res = await request(app).delete("/api/vehicles/7").set(auth(role));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vehicle deleted successfully");
    expect(DeleteObjectCommand).toHaveBeenCalledTimes(1);
    expect(DeleteObjectCommand).toHaveBeenCalledWith({ Bucket: "test-bucket", Key: "vehicles/7/1-a.jpg" });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("SELECT imagepath"), ["7"]);
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("DELETE FROM vehicle_images"), ["7"]);
    expect(pool.query).toHaveBeenNthCalledWith(3, expect.stringContaining("DELETE FROM vehicle WHERE"), ["7"]);
  });

  test("500 when S3 fails: nothing is deleted from the database", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ imagepath: `${BASE}vehicles/7/1-a.jpg` }] });
    mockSend.mockRejectedValueOnce(new Error("S3 down"));

    const res = await request(app).delete("/api/vehicles/7").set(auth("admin"));

    expect(res.status).toBe(500);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test("500 when the database fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));
    const res = await request(app).delete("/api/vehicles/7").set(auth("admin"));
    expect(res.status).toBe(500);
  });
});

