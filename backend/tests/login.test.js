process.env.JWT_SECRET = "test-secret";

jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));
jest.mock("../logger", () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() }));
jest.mock("../logger", () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), http: jest.fn() }));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const app = require("../app");
const logger = require("../logger");

const user = { id: 7, email: "admin@example.com", password_hash: "hashed", role: "admin" };

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  pool.query.mockReset();
  bcrypt.compare.mockReset();
  logger.warn.mockClear();
});

describe("POST /api/login", () => {
  test("401 when the email is unknown", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/v1/login").send({ email: "nobody@example.com", password: "x" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith("Login failed: unknown email");
  });

  test("401 when the password is wrong", async () => {
    pool.query.mockResolvedValueOnce({ rows: [user] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app).post("/api/v1/login").send({ email: user.email, password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
    expect(logger.warn).toHaveBeenCalledWith("Login failed: wrong password for user id 7");
  });

  test("200 with a valid token when the password is right", async () => {
    pool.query.mockResolvedValueOnce({ rows: [user] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app).post("/api/v1/login").send({ email: user.email, password: "right" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("admin");
    expect(res.body.email).toBe(user.email);
    const decoded = jwt.verify(res.body.token, "test-secret");
    expect(decoded).toMatchObject({ id: 7, role: "admin", email: user.email });
  });

  test("500 when the database fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));

    const res = await request(app).post("/api/v1/login").send({ email: user.email, password: "x" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("db down");
  });
    test("each request is written to the logger at http level", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await request(app).post("/api/v1/login").send({ email: "x@example.com", password: "x" });
    await new Promise((resolve) => setImmediate(resolve));

    expect(logger.http).toHaveBeenCalledWith(expect.stringMatching(/^POST \/api\/v1\/login 401 /));
  });
});