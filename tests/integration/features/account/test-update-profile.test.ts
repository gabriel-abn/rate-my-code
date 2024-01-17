import app from "@main/server";

import { faker } from "@faker-js/faker";
import redisDb from "@infra/persistence/database/redis-db";
import RandExp from "randexp";
import request from "supertest";

describe.skip("Update profile", () => {
  let fakeRequest: {
    email: string;
    password: string;
    token: string;
  };

  beforeEach(async () => {
    fakeRequest = {
      email: faker.internet.email(),
      password: new RandExp(/^[a-zA-Z0-9!@#$%¨&*]{16,64}$/).gen(),
      token: "",
    };

    const response = await request(app)
      .post("/api/sign-in")
      .send({
        email: fakeRequest.email,
        password: fakeRequest.password,
        role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
      });

    fakeRequest.token = response.body.accessToken;
  });

  it("should receive 401 if user not authenticated", async () => {
    const response = await request(app).put("/api/update-profile").send({
      firstName: faker.person.firstName(),
    });

    expect(response.body.error).toBe("UNAUTHORIZED");
    expect(response.status).toBe(401);
  });

  it("should receive 400 if user's not verified", async () => {
    const response = await request(app)
      .put("/api/update-profile")
      .send({
        firstName: faker.person.firstName(),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.body.error).toBe("EMAIL_NOT_VERIFIED");
    expect(response.status).toBe(400);
  });

  it("should receive 404 if token is invalid", async () => {
    const response = await request(app)
      .put("/api/update-profile")
      .send({
        firstName: faker.person.firstName(),
      })
      .auth("fakeToken", { type: "bearer" });

    expect(response.body.message).toBe("Invalid token.");
    expect(response.status).toBe(404);
  });

  it("should update user profile if exists", async () => {
    const emailToken = await redisDb.get(fakeRequest.email);

    await request(app)
      .post("/api/verify-email")
      .send({
        email: fakeRequest.email,
        token: emailToken,
      })
      .auth(fakeRequest.token, { type: "bearer" });

    const response = await request(app)
      .put("/api/update-profile")
      .send({
        firstName: faker.person.firstName(),
      })
      .auth(fakeRequest.token, { type: "bearer" });

    expect(response.body.updated).toBeTruthy();
    expect(response.status).toBe(200);
  });
});
