import { adaptRoute } from "@main/adapters/express-route-adapter";

import deletePostFactory from "@main/factories/post/delete-post-factory";
import editPostFactory from "@main/factories/post/edit-post-factory";
import getAllPostsFactory from "@main/factories/post/get-all-posts-factory";
import getPostFactory from "@main/factories/post/get-post-factory";
import makePostFactory from "@main/factories/post/make-post-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

const routes = Router();

routes.post("/make", adaptRoute(makePostFactory.create()));

routes.get("/get", adaptRoute(getPostFactory.create()));

routes.get("/get-all", adaptRoute(getAllPostsFactory.create()));

routes.put("/edit", adaptRoute(editPostFactory.create()));

routes.delete("/delete", adaptRoute(deletePostFactory.create()));

const postRouter = Router().use("/post", authMiddleware(), routes);

export default postRouter;
