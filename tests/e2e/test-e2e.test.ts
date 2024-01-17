import app from "@main/server";

import { faker } from "@faker-js/faker";
import redisDb from "@infra/persistence/database/redis-db";
import request from "supertest";

describe("Test e2e", () => {
  const account = {
    email: faker.internet.email(),
    password: "Gabriel!1234",
    role: "DEVELOPER",
  };

  let signin: any,
    confirmEmail: any,
    updateProfile: any,
    login: any,
    createPost: any,
    giveFeedback: any;

  it("should create account", async () => {
    signin = await request(app).post("/api/account/sign-in").send(account);

    expect(signin.status).toBe(200);
  });

  it("should confirm email", async () => {
    const token = await redisDb.get(account.email);

    confirmEmail = await request(app)
      .post("/api/account/verify-email")
      .send({ token: token, email: account.email })
      .auth(signin.body.accessToken, { type: "bearer" });

    expect(confirmEmail.status).toBe(200);
  });

  it("should login", async () => {
    login = await request(app).post("/api/account/login").send(account);

    expect(login.status).toBe(200);
  });

  it("should update profile", async () => {
    const profile = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.internet.url(),
    };

    updateProfile = await request(app)
      .put("/api/account/update-profile")
      .send(profile)
      .auth(login.body.accessToken, { type: "bearer" });

    expect(updateProfile.status).toBe(200);
  });

  it("should create post", async () => {
    const post = {
      title: faker.lorem.words(3),
      content: faker.lorem.paragraph(3),
      tags: [faker.lorem.word(), faker.lorem.word()],
    };

    createPost = await request(app)
      .post("/api/post/make")
      .send(post)
      .auth(login.body.accessToken, { type: "bearer" });

    expect(createPost.status).toBe(200);
  });

  it("should be able to give feedback", async () => {
    const feedback = {
      postId: createPost.body.id,
      content: faker.lorem.paragraph(3),
    };

    giveFeedback = await request(app)
      .post("/api/feedback/make")
      .send(feedback)
      .auth(login.body.accessToken, { type: "bearer" });

    expect(giveFeedback.status).toBe(200);
  });

  it("should be able to rate feedback", async () => {
    const rateFeedback = await request(app)
      .post("/api/feedback/rate")
      .send({
        postId: giveFeedback.body.id,
        rating: 3,
      })
      .auth(login.body.accessToken, { type: "bearer" });

    expect(rateFeedback.status).toBe(200);
  });

  it("should be able to update feedback rating", async () => {
    const rateFeedback = await request(app)
      .post("/api/feedback/rate")
      .send({
        postId: giveFeedback.body.id,
        rating: 5,
      })
      .auth(login.body.accessToken, { type: "bearer" });

    expect(rateFeedback.status).toBe(200);
    expect(rateFeedback.body.updatedRating).toBe(4);
  });
});
