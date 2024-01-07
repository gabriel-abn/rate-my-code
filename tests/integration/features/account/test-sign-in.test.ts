import redisDb from "@infra/persistence/database/redis-db";
import emailService from "@infra/services/email-service";

import app from "@main/server";

import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import request from "supertest";

describe("Sign In", () => {
  let fakeRequest: {
    email: string;
    password: string;
    role: string;
  };

  beforeEach(() => {
    fakeRequest = {
      email: faker.internet.email(),
      password: new RandExp(/[[a-z]{1,4}[A-Z]{1,4}[0-9]{1,4}[!@#$%^&*]{1,4}]/).gen(),
      role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
    };
  });

  // afterAll(async () => {
  //   await redis.del(fakeRequest.email);
  //   await prisma.user.deleteMany({});
  // });

  it("should receive 400 if email already exists", async () => {
    const { email, password, role } = fakeRequest;

    await request(app).post("/api/sign-in").send({
      email,
      password,
      role,
    });

    const response = await request(app).post("/api/sign-in").send({
      email,
      password,
      role,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already in use.");
  });

  it("should receive 400 if email field is invalid", async () => {
    fakeRequest.email = "fake";

    const response = await request(app).post("/api/sign-in").send(fakeRequest);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email.");
  });

  describe("Password rules", () => {
    it("password is too short", async () => {
      const { role } = fakeRequest;

      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "123",
        role,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password must be at least 6 characters.");
    });

    it("password is too long", async () => {
      const { role } = fakeRequest;

      const response = await request(app)
        .post("/api/sign-in")
        .send({
          email: "jonhdoe@gmail.com",
          password: new RandExp(/[a-zA-Z0-9!@#$%^&*]{65}/).gen(),
          role,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password must be at most 64 characters.");
    });

    it("password doesnt have numbers", async () => {
      const { role } = fakeRequest;

      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "Password",
        role,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password must contain at least one number.");
    });

    it("password doesnt have special caracters", async () => {
      const { role } = fakeRequest;

      const response = await request(app).post("/api/sign-in").send({
        email: "johndoe@gmail.com",
        password: "Password123",
        role,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Password must contain at least one special character.",
      );
    });
  });

  describe("Sending valid email and password", async () => {
    const sendEmail = emailService;

    const validRequest = {
      email: faker.internet.email(),
      password: new RandExp(/[[a-z]{1,4}[A-Z]{1,4}[0-9]{1,4}[!@#$%^&*]{1,4}]/).gen(),
      role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
    };

    const response = await request(app)
      .post("/api/sign-in")
      .send({ ...validRequest });

    it("should receive 200 and access token", async () => {
      expect(response.body).toHaveProperty("accessToken", expect.any(String));
      expect(response.status).toBe(200);
    });

    it("should receive email with confirmation token", () => {
      expect(
        sendEmail.emails.filter(
          (email) => email.to === validRequest.email && "token" in email.data,
        ).length,
      ).toBe(1);
    });

    it("should save token in redis", async () => {
      const token = await redisDb.get(validRequest.email);
      expect(token).toBeDefined();
    });
  });
});
