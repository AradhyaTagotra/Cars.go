jest.mock("../db", () => ({ query: jest.fn() }));

const request = require("supertest");
const pool = require("../db");
const app = require("../index");

beforeEach(() => {
  pool.query.mockReset();
});

describe("GET /api/test-db", () => {
  test("200 returns the database time", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ now: "2026-11-05T10:00:00Z" }] });
    const res = await request(app).get("/api/test-db");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ now: "2026-11-05T10:00:00Z" }]);
  });

  test("500 when the database fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));
    const res = await request(app).get("/api/test-db");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("db down");
  });
});

describe("GET /api/lookups", () => {
  test("200 returns all five lookup lists", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Audi" }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Available" }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Manual" }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Petrol" }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Hatchback" }] });

    const res = await request(app).get("/api/lookups");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      makes: [{ id: 1, name: "Audi" }],
      statuses: [{ id: 1, name: "Available" }],
      gearboxTypes: [{ id: 1, name: "Manual" }],
      fuelTypes: [{ id: 1, name: "Petrol" }],
      bodyTypes: [{ id: 1, name: "Hatchback" }],
    });
    expect(pool.query).toHaveBeenCalledTimes(5);
  });

  test("500 when one of the queries fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));
    const res = await request(app).get("/api/lookups");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("db down");
  });
});