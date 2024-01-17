import { adaptRoute } from "@main/adapters/express-route-adapter";

import deleteFeedbackFactory from "@main/factories/feedback/delete-feedback-factory";
import editFeedbackFactory from "@main/factories/feedback/edit-feedback-factory";
import giveFeedbackFactory from "@main/factories/feedback/give-feedback-factory";
import rateFeedbackFactory from "@main/factories/feedback/rate-feedback-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

const routes = Router();

routes.post("/rate", adaptRoute(rateFeedbackFactory.create()));
routes.post("/make", adaptRoute(giveFeedbackFactory.create()));
routes.put("/update", adaptRoute(editFeedbackFactory.create()));
routes.delete("/delete", adaptRoute(deleteFeedbackFactory.create()));

const feedbackRoutes = Router().use("/feedback", authMiddleware(), routes);

export default feedbackRoutes;
