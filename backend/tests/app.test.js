jest.mock("../db", () => ({query: jest.fn()}));

const request = require("supertest");
const app = require("../index");

test("GET / says the backend is running", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Carslist backend is running");
});