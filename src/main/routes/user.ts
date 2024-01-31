import { adaptRoute } from "@main/adapters/express-route-adapter";
import loadUserFeedFactory from "@main/factories/feed/load-user-feed-factory";
import getAllPostsFactory from "@main/factories/post/get-all-posts-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { Router } from "express";

const routes = Router();

routes.get("/feed", authMiddleware(), adaptRoute(loadUserFeedFactory.create()));

routes.get("/:username/posts", adaptRoute(getAllPostsFactory.create()));

const userRoutes = Router().use("/user", routes);

export default userRoutes;
