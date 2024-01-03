import app from "@main/server";

import { faker } from "@faker-js/faker";
import RedisDB from "@infra/persistence/database/redis-db";
import RandExp from "randexp";
import request from "supertest";

describe("Login", () => {
  const fakeRequest = {
    email: faker.internet.email(),
    password: new RandExp(/[[a-z]{1,4}[A-Z]{1,4}[0-9]{1,4}[!@#$%^&*]{1,4}]/).gen(),
  };

  const redis = RedisDB.getInstance();

  beforeAll(async () => {
    const { email, password } = fakeRequest;

    await request(app).post("/api/sign-in").send({
      email,
      password,
    });
  });

  // afterAll(async () => {
  //   await redis.del(fakeRequest.email);
  //   await prisma.user.deleteMany();
  // });

  it("should return 400 if password is incorrect", async () => {
    const { email } = fakeRequest;

    const response = await request(app).post("/api/login").send({
      email,
      password: "incorrect_password",
    });

    expect(response.body.message).toBe("Invalid password.");
    expect(response.status).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    const noEmail = await request(app).post("/api/login").send({
      password: fakeRequest.password,
    });

    const emptyEmail = await request(app).post("/api/login").send({
      email: "",
      password: fakeRequest.password,
    });

    expect(noEmail.body.message).toBe("Email is required.");
    expect(noEmail.status).toBe(400);

    expect(emptyEmail.body.message).toBe("Invalid email format.");
    expect(emptyEmail.status).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    const noPassword = await request(app).post("/api/login").send({
      email: fakeRequest.email,
    });

    const emptyPassword = await request(app).post("/api/login").send({
      email: fakeRequest.email,
      password: "",
    });

    expect(noPassword.body.message).toBe("Valid password is required.");
    expect(noPassword.status).toBe(400);

    expect(emptyPassword.body.message).toBe("Valid password is required.");
    expect(emptyPassword.status).toBe(400);
  });

  it("should return 400 if email is incorrect or not exists", async () => {
    const response = await request(app).post("/api/login").send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.body.message).toBe("Email is incorrect or user does not exists.");
    expect(response.status).toBe(400);
  });

  it("should return 400 if email not verified", async () => {
    const { email, password } = fakeRequest;

    const response = await request(app).post("/api/login").send({
      email,
      password,
    });

    expect(response.body.message).toBe("Email not verified.");
    expect(response.status).toBe(400);
  });

  it("should return 200 and access token if email and password is correct", async () => {
    const { email, password } = fakeRequest;

    const token = await redis.get(email);

    await request(app).post("/api/verify-email").send({
      email,
      token,
    });

    const response = await request(app).post("/api/login").send({
      email,
      password,
    });

    expect(response.body).toHaveProperty("accessToken");
    expect(response.status).toBe(200);
  });
});
