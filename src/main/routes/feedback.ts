import { adaptRoute } from "@main/adapters/express-route-adapter";

import deleteFeedbackFactory from "@main/factories/feedback/delete-feedback-factory";
import editFeedbackFactory from "@main/factories/feedback/edit-feedback-factory";
import giveFeedbackFactory from "@main/factories/feedback/give-feedback-factory";
import rateFeedbackFactory from "@main/factories/feedback/rate-feedback-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

const feedbackRoutes = Router();

feedbackRoutes.post("/rate", adaptRoute(rateFeedbackFactory.create()));

feedbackRoutes.post("/make", authMiddleware(), adaptRoute(giveFeedbackFactory.create()));

feedbackRoutes.put("/update", adaptRoute(editFeedbackFactory.create()));

feedbackRoutes.delete("/delete", adaptRoute(deleteFeedbackFactory.create()));

export default feedbackRoutes;
