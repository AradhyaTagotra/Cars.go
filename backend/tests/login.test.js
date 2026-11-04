process.env.JWT_SECRET = "test-secret";

jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const app = require("../index");

const user = { id: 7, email: "admin@example.com", password_hash: "hashed", role: "admin" };

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  pool.query.mockReset();
  bcrypt.compare.mockReset();
});

describe("POST /api/login", () => {
  test("401 when the email is unknown", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/login").send({ email: "nobody@example.com", password: "x" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("401 when the password is wrong", async () => {
    pool.query.mockResolvedValueOnce({ rows: [user] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app).post("/api/login").send({ email: user.email, password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });

  test("200 with a valid token when the password is right", async () => {
    pool.query.mockResolvedValueOnce({ rows: [user] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app).post("/api/login").send({ email: user.email, password: "right" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("admin");
    expect(res.body.email).toBe(user.email);
    const decoded = jwt.verify(res.body.token, "test-secret");
    expect(decoded).toMatchObject({ id: 7, role: "admin", email: user.email });
  });

  test("500 when the database fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));

    const res = await request(app).post("/api/login").send({ email: user.email, password: "x" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("db down");
  });
});