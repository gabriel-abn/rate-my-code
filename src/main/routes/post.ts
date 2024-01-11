import { adaptRoute } from "@main/adapters/express-route-adapter";

import deletePostFactory from "@main/factories/post/delete-post-factory";
import editPostFactory from "@main/factories/post/edit-post-factory";
import getAllPostsFactory from "@main/factories/post/get-all-posts-factory";
import getPostFactory from "@main/factories/post/get-post-factory";
import makePostFactory from "@main/factories/post/make-post-factory";

import { Router } from "express";

export const postRouter = Router();

postRouter.post("/make", adaptRoute(makePostFactory.create()));

postRouter.get("/get", adaptRoute(getPostFactory.create()));

postRouter.get("/get-all", adaptRoute(getAllPostsFactory.create()));

postRouter.put("/edit", adaptRoute(editPostFactory.create()));

postRouter.delete("/delete", adaptRoute(deletePostFactory.create()));
