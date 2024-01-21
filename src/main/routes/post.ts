import { adaptRoute } from "@main/adapters/express-route-adapter";

import deletePostFactory from "@main/factories/post/delete-post-factory";
import editPostFactory from "@main/factories/post/edit-post-factory";
import getAllPostsFactory from "@main/factories/post/get-all-posts-factory";
import getPostWithFeedbackFactory from "@main/factories/post/get-post-with-feedback-factory";
import makePostFactory from "@main/factories/post/make-post-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

const routes = Router();

routes.post("/make", authMiddleware(), adaptRoute(makePostFactory.create()));

routes.get("/:id", adaptRoute(getPostWithFeedbackFactory.create()));

routes.get("/", adaptRoute(getAllPostsFactory.create()));

routes.put("/edit", authMiddleware(), adaptRoute(editPostFactory.create()));

routes.delete("/delete", authMiddleware(), adaptRoute(deletePostFactory.create()));

const postRouter = Router().use("/post", routes);

export default postRouter;
