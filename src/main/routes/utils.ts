import { adaptRoute } from "@main/adapters/express-route-adapter";
import getAllTagsFactory from "@main/factories/utils/get-all-tags-factory";
import { Router } from "express";

const routes = Router();

routes.get("/tags", adaptRoute(getAllTagsFactory.create()));

const utilsRouter = Router().use("/utils", routes);

export default utilsRouter;
