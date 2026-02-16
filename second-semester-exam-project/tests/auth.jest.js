const request = require("supertest");
const app = require("../app");

describe("Auth Endpoints", () => {

  let userToken;

  it("should signup user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();

    userToken = res.body.token;
  });

});
