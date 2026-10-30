const jwt = require("jsonwebtoken");
const verifyToken =require("../authMiddleware");

const SECRET = "test-secret";

function makeRes(){
    const res ={};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
});

describe("verifyToken", () => {
    test("returns 401 when no Authorization header are sent", () => {
        const req = {headers: {}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: "No token provided"});
        expect(next).not.toHaveBeenCalled();
    });
    test("returns 403 when the token is garbage", () => {
        const req = {headers: {authorization: "Bearer not-a-real-token"}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({error: "Invalid or expired token"});
        expect(next).not.toHaveBeenCalled();
    });

    test("returns 403 when the header has no token after Bearer", () => {
        const req = {headers: {authorization: "Bearer"}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test("returns 403 when the token was signed with a different secret", () => {
        const token = jwt.sign({id:1, role: "admin"}, "some-other-secret");
        const req = {headers: {authorization: `Bearer ${token}`}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test("returns 403 when the token has expired", () => {
        const token = jwt.sign({id:1, role: "admin"}, SECRET, {expiresIn: -10});
        const req = {headers: {authorization: `Bearer ${token}`}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test("calls next and sets req.user for a valid token", () => {
        const payload = {id :1, role: "admin", email: "at@.com"};
        const token = jwt.sign(payload, SECRET, {expiresIn: "1h"});
        const req = {headers: {authorization: `Bearer ${token}`}};
        const res= makeRes();
        const next =jest.fn();

        verifyToken(req, res, next);
        
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject(payload);
        expect(res.status).not.toHaveBeenCalled();
        
    });
});