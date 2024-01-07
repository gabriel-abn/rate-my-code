import prisma from "@infra/persistence/database/prisma";
import redisDb from "@infra/persistence/database/redis-db";

import app from "@main/server";

import { faker } from "@faker-js/faker";
import request from "supertest";

describe("Verify Email", () => {
  let auth: string;
  let token: string;

  let fakeRequest: {
    email: string;
    password: string;
    role: string;
  };

  beforeAll(async () => {
    fakeRequest = {
      email: faker.internet.email(),
      password: "Gabriel1234!@#$",
      role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
    };

    const response = await request(app)
      .post("/api/sign-in")
      .send({ ...fakeRequest });

    auth = response.body.accessToken;
    token = await redisDb.get(fakeRequest.email);
  });

  // afterAll(async () => {
  //   await redis.del();
  //   await prisma.user.deleteMany({});
  // });

  it("should receive a 400 if email not found", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: "fake@gmail.com",
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.body.error).toBe("EMAIL_NOT_FOUND");
    expect(response.status).toBe(400);
  });

  it("should receive a 400 if token is invalid", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.body.error).toBe("INVALID_TOKEN");
    expect(response.status).toBe(400);
  });

  it("should receive a 400 if email is already verified", async () => {
    const verifiedEmail = faker.internet.email();

    await request(app).post("/api/sign-in").send({
      email: verifiedEmail,
      password: fakeRequest.password,
      role: fakeRequest.role,
    });

    const token = await redisDb.get(verifiedEmail);

    await request(app)
      .post("/api/verify-email")
      .send({
        email: verifiedEmail,
        token,
      })
      .auth(auth, { type: "bearer" });

    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: verifiedEmail,
        token,
      })
      .auth(auth, { type: "bearer" });

    expect(response.body.error).toBe("EMAIL_ALREADY_VERIFIED");
    expect(response.status).toBe(400);
  });

  it("should receive a 400 if token is expired", async () => {
    const response = await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token: "123",
      })
      .auth(auth, { type: "bearer" });

    expect(response.body.error).toBe("INVALID_TOKEN");
    expect(response.status).toBe(400);
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
