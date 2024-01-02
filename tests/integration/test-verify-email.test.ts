import prisma from "@infra/persistence/database/prisma";
import RedisDB from "@infra/persistence/database/redis-db";

import app from "@main/server";

import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import request from "supertest";

describe("Verify Email", () => {
  let auth: string;
  let token: string;

  const redis = RedisDB.getInstance();

  const fakeRequest = {
    email: faker.internet.email(),
    password: new RandExp(/[[a-z]{1,4}[A-Z]{1,4}[0-9]{1,4}[!@#$%^&*]{1,4}]/).gen(),
  };

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/sign-in")
      .send({ ...fakeRequest });

    auth = response.body.token;
    token = await redis.get(fakeRequest.email);
  });

  afterAll(async () => {
    await redis.del();
    await prisma.user.deleteMany({});
  });

  it("should receive a 400 if email not found", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: "fake@gmail.com",
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("EMAIL_NOT_FOUND");
  });

  it("should receive a 400 if token is invalid", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_TOKEN");
  });

  it("should receive a 400 if token is expired", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_TOKEN");
  });

  it("should receive a 200 when the email is verified", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token,
      })
      .auth(auth, { type: "bearer" });

    const { emailVerified } = await prisma.user.findUnique({
      select: { emailVerified: true },
      where: { email: fakeRequest.email },
    });

    expect(response.body.message).toBe("Email verified successfully.");
    expect(response.status).toBe(200);
    expect(emailVerified).toBe(true);
  });
});
