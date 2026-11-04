process.env.JWT_SECRET = "test-secret";

jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const app = require("../index");

const tokenFor = (role) => 
    jwt.sign({id: 1, role, email:"test-user@example"}, "test-secret", {expiresIn:"1h"});

const newAdmin = { email: "new-admin@example.com", password: "plain-text-pw" };


beforeEach(() => {
  pool.query.mockReset();
  bcrypt.compare.mockReset();
});

describe("POST /api/admin/create-admin", () => {
    test("401 without a token" ,async () =>{
        const res =await request(app).post("/api/admin/create-admin").send(newAdmin);
        expect(res.status).toBe(401);
    });

    test("403 for an admin: Only root may create admins" ,async () =>{
        const res =await request(app)
        .post("/api/admin/create-admin")
        .set("Authorization", `Bearer ${tokenFor("admin")}`)
        .send(newAdmin);

        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Only the root user can create admin accounts");
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("403 for a normal user" ,async () =>{
        const res =await request(app)
        .post("/api/admin/create-admin")
        .set("Authorization", `Bearer ${tokenFor("user")}`)
        .send(newAdmin);

        expect(res.status).toBe(403);
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("200 for root: stores the hashed password, never the plain one" ,async () =>{
        bcrypt.hash.mockResolvedValueOnce("hashed-pw");
        pool.query.mockResolvedValueOnce({rows:[{id:9, email:newAdmin.email, role: "admin"}]});

        const res =await request(app)
        .post("/api/admin/create-admin")
        .set("Authorization", `Bearer ${tokenFor("root")}`)
        .send(newAdmin);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Admin created successfully");
        expect(res.body.user).toEqual({id:9, email:newAdmin.email, role: "admin"});
        expect(bcrypt.hash).toHaveBeenCalledWith("plain-text-pw", 10); 
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO users"),
            [newAdmin.email, "hashed-pw", "admin"]
        );
        expect(JSON.stringify(res.body)).not.toContain("hashed-pw");
    });

    test("500 when the database fails, for example a duplicate email" ,async () =>{
        bcrypt.hash.mockResolvedValueOnce("hashed-pw");
        pool.query.mockRejectedValueOnce(new Error("duplicate key"));

        const res =await request(app)
        .post("/api/admin/create-admin")
        .set("Authorization", `Bearer ${tokenFor("root")}`)
        .send(newAdmin);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("duplicate key");
    });
});