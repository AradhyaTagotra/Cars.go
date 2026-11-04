jest.mock("../db", () => ({ query: jest.fn() }));

const request = require("supertest");
const pool = require("../db");
const app = require("../index");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  pool.query.mockReset();
});

describe("GET /api/vehicles", () => {
    test("200: attaches each vehicle own image's", async () => {
        pool.query
        .mockResolvedValueOnce({rows: [{id: 1, make: "Audi", model: "A3"}, {id:2, make: "BMW", model:"M2"}]})
        .mockResolvedValueOnce({rows: [
            {id:10, vehicleid: 1, imagepath: "img-a"},
            {id:11, vehicleid: 1, imagepath: "img-b"},
            {id:12, vehicleid: 2, imagepath: "img-c"},
        ],
    });
    const res =await request(app).get("/api/vehicles");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].images.map((i) => i.id)).toEqual([10,11]);
    expect(res.body[1].images.map((i) => i.id)).toEqual([12]);
    });

    test("200: a vehicle without images gets an empty list", async () => {
        pool.query
        .mockResolvedValueOnce({rows: [{id: 1, make: "Audi", model: "A3"}]})
        .mockResolvedValueOnce({rows: [],
    });
    const res =await request(app).get("/api/vehicles");

    expect(res.status).toBe(200);
    expect(res.body[0].images).toEqual([]);
    });

    test("500 when the database fails" ,async () =>{
        pool.query.mockRejectedValueOnce(new Error("db down"));

        const res =await request(app).get("/api/vehicles")
        
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("db down");
    });
});

describe("GET /api/vehicles/:id",() => {
    test("404 when the vehicle does not exist", async () => {
        pool.query.mockResolvedValueOnce({rows: []});

        const res = await request(app).get("/api/vehicles/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Vehicle not found");
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
    test("200 returns the vehicle with its images", async () => {
        pool.query
        .mockResolvedValueOnce({rows: [{id:1, make:"Audi", model:"A3"}]})
        .mockResolvedValueOnce({rows:[{id:10, vehicleid:1, imagepath:"img-a"}]})

        const res = await request(app).get("/api/vehicles/1");

        expect(res.status).toBe(200);
        expect(res.body.make).toBe("Audi");
        expect(res.body.images).toHaveLength(1);
        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), ["1"]);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("vehicle_images"), ["1"]);
    });

    test("500 with a generic message when  the database fails" ,async () =>{
        pool.query.mockRejectedValueOnce(new Error("secret db detail"));

        const res =await request(app).get("/api/vehicles/1")
        
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Server error");
    });
});