import env from "./config/env";
import accountRoutes from "./routes/account";
import feedbackRoutes from "./routes/feedback";
import postRouter from "./routes/post";
import userRoutes from "./routes/user";

import cors from "cors";
import express, { Request, Response, json } from "express";
import utilsRouter from "./routes/utils";

const app = express();

app.use([json(), cors()]);

app.listen(env.PORT, () => {
  if (env.NODE_ENV !== "test") {
    console.log(`Environment: ${env.NODE_ENV}\n`);
    console.log(`Server is running on port ${env.PORT}`);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello world! Server is running.",
    hostname: req.hostname,
  });
});

app.use("/api", [feedbackRoutes, accountRoutes, postRouter, userRoutes, utilsRouter]);

export default app;
