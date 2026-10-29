const {isAdminRole, getS3Key} =require("../helpers");

describe("isAdminRole" ,() => {
    test("root is allowed", () => expect(isAdminRole("root")).toBe(true));
    test("admin is allowed", () => expect(isAdminRole("admin")).toBe(true));
    test("user is  not allowed", () => expect(isAdminRole("user")).toBe(false));
    test("missing role is not allowed", () => expect(isAdminRole(undefined)).toBe(false));
});

describe("getS3Key", () => {
    const bucket = "carfinder-vehicle-images";
    const region  = "eu-north-1";
    const base =`https://${bucket}.s3.${region}.amazonaws.com/`;

    test("returns the key for a file in our bucket", () => {
        expect(getS3Key(`${base}vehicles/3/123-car.jpg`,bucket, region )).toBe("vehicles/3/123-car.jpg");
    });
    test("returns null for an external link", () => {
        expect(getS3Key("https://m.atcdn.co.uk/a/media/x.jpg",bucket, region )).toBeNull();
    });
    test("returns null for an empty value key", () => {
        expect(getS3Key(null,bucket, region )).toBeNull();
    });
});