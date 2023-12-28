import app from "@main/server";

import request from "supertest";

describe("Sign In", () => {
  const fake_request = {
    email: "gabriel@gmail.com",
    password: "Gabriel123!",
  };

  it("should get status 400 if email already exists", async () => {
    fake_request.email = "fake@gmail.com";

    const response = await request(app)
      .post("/api/sign-in")
      .send({ ...fake_request });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already in use.");
  });

  it("should receive 400 if email field is invalid", async () => {
    fake_request.email = "fake";

    const response = await request(app).post("/api/sign-in").send(fake_request);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email");
  });

  describe("Password rules", () => {
    it("password is too short", async () => {
      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must be at least 6 characters.",
      );
    });

    it("password is too long", async () => {
      const response = await request(app).post("/api/sign-in").send({
        email: "jonhdoe@gmail.com",
        password:
          "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must be at most 64 characters.",
      );
    });

    it("password doesnt have numbers", async () => {
      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "Password",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must contain at least one number.",
      );
    });

    it("password doesnt have special caracters", async () => {
      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "Password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must contain at least one special character.",
      );
    });
  });
});
