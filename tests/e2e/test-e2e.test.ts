import redisDb from "@infra/persistence/database/redis-db";
import app from "@main/server";

import { faker } from "@faker-js/faker";
import request from "supertest";

const fakeTags = [
  "javascript",
  "typescript",
  "react",
  "react-native",
  "nodejs",
  "express",
  "mongodb",
  "postgres",
  "mysql",
  "redis",
  "docker",
  "aws",
  "azure",
  "google-cloud",
  "kubernetes",
  "graphql",
  "apollo",
  "jest",
  "cypress",
  "testing-library",
  "storybook",
];

describe.sequential("Test e2e", () => {
  const account = {
    email: faker.internet.email(),
    password: "Gabriel!1234",
    role: faker.helpers.arrayElement(["DEVELOPER", "INSTRUCTOR"]),
    username: faker.internet.userName(),
  };

  let signin: any, confirmEmail: any, updateProfile: any, login: any;

  let createPost: any, giveFeedback: any;

  const post = {
    title: faker.lorem.words(3),
    content: faker.lorem.paragraph(3),
    tags: faker.helpers.arrayElements(fakeTags, { min: 3, max: 5 }),
  };

  describe("Account", () => {
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

    it.skip("should be able to reset password", async () => {
      const resetPassword = await request(app)
        .post("/api/account/reset-password")
        .send({ email: account.email });

      expect(resetPassword.status).toBe(200);
    });

    it("should update profile", async () => {
      const profile = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.internet.url(),
        tags: ["javascript", "typescript", "react"],
      };

      updateProfile = await request(app)
        .put("/api/account/update-profile")
        .send(profile)
        .auth(login.body.accessToken, { type: "bearer" });

      expect(updateProfile.status).toBe(200);
    });
  });

  describe("Making posts and feedbacks", () => {
    it("should create post", async () => {
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

      expect(rateFeedback.body.updatedRating).toBe(4);
      expect(rateFeedback.status).toBe(200);
    });
  });

  describe("User's feed and subscriptions", () => {
    it("should be able to return user's feed data", async () => {
      await request(app)
        .put("/api/account/update-profile")
        .send({
          firstName: faker.person.firstName(),
          tags: [post.tags[0], post.tags[1]],
        })
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(200);

      const feed = await request(app)
        .get("/api/user/feed")
        .auth(login.body.accessToken, { type: "bearer" });

      expect(feed.status).toBe(200);
    });

    it("should be able to get specific post with all of its feedbacks", async () => {
      const post = await request(app).get(`/api/post/${createPost.body.id}`);

      expect(post.status).toBe(200);
    });

    it("should be able to get all posts from specific tags", async () => {
      const postsTag = await request(app)
        .get("/api/post/")
        .query({ tags: ["javascript"] });

      const postsTag2 = await request(app)
        .get("/api/post/")
        .query({ tags: ["typescript", "aws"] });

      expect(postsTag.status).toBe(200);
      expect(postsTag2.status).toBe(200);
    });

    it("should be able to get all posts and feedbacks from an user", async () => {
      const postsFromUser = await request(app).get(`/api/user/${account.username}/posts`);

      expect(postsFromUser.status).toBe(200);
    });
  });
});
