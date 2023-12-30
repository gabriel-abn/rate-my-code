import prisma from "@infra/persistence/database/prisma";
import RedisDB from "@infra/persistence/database/redis-db";
import emailService from "@infra/services/email-service";
import app from "@main/server";

import request from "supertest";

describe("Sign In", () => {
  const redis = RedisDB.getInstance();

  let fake_request: {
    email: string;
    password: string;
  };

  beforeEach(() => {
    fake_request = {
      email: "gabriel@gmail.com",
      password: "Gabriel123!",
    };
  });

  afterAll(async () => {
    await redis.del("gabriel@gmail.com");
    await prisma.user.deleteMany({});
  });

  it("should receive 400 if email already exists", async () => {
    await prisma.user.create({
      data: {
        email: "fake@gmail.com",
        password: "Fake123!",
      },
    });

    const response = await request(app).post("/api/sign-in").send({
      email: "fake@gmail.com",
      password: "Fake123!",
    });

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

  describe("Sending valid email and password", async () => {
    const email = emailService;

    const response = await request(app).post("/api/sign-in").send({
      email: "gabriel.nascimento@gmail.com",
      password: "Gabriel123!",
    });

    it("should receive 200 and access token", async () => {
      expect(response.body).toHaveProperty("accessToken");
      expect(response.status).toBe(200);
    });

    it("should receive email with confirmation token", () => {
      expect(email.emails.length).toBeGreaterThanOrEqual(1);
      expect(() =>
        email.emails.find(
          (email) => email.to === "gabriel.nascimento@gmail.com" && "token" in email.data,
        ),
      ).toBeTruthy();
    });

    it("should save token in redis", async () => {
      const token = await redis.get("gabriel.nascimento@gmail.com");

      expect(token).toBeTruthy();
    });
  });
});
