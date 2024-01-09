import redisDb from "@infra/persistence/database/redis-db";

import app from "@main/server";

import { faker } from "@faker-js/faker";
import request from "supertest";

describe.skip("Make post", () => {
  let fakeRequest: {
    email: string;
    password: string;
    token: string;
  };

  beforeAll(async () => {
    fakeRequest = {
      email: faker.internet.email(),
      password: "Gabriel1234!@#$",
      token: "",
    };

    const signed = await request(app)
      .post("/api/sign-in")
      .send({
        email: fakeRequest.email,
        password: fakeRequest.password,
        role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
      });

    const token = await redisDb.get(fakeRequest.email);

    await request(app).post("/api/verify-email").send({
      email: fakeRequest.email,
      token,
    });

    fakeRequest.token = signed.body.accessToken;
  });

  it("should return 401 if user is not authenticated", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(10),
      });

    expect(response.status).toBe(401);
  });

  it("should return 400 if title is not provided", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        content: faker.lorem.paragraph(10),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title is required.");
  });

  it("should return 400 if content is not provided", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        title: faker.lorem.words(3),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content is required.");
  });

  it("should return 400 if title is less than 3 characters", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        title: "ab",
        content: faker.lorem.paragraph(10),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title must be at least 3 characters.");
  });

  it("should return 400 if content is less than 3 characters", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        title: faker.lorem.words(3),
        content: "ab",
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content must be at least 3 characters.");
  });

  it("should return 201 if post is created", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(10),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.status).toBe(201);
  });
});
