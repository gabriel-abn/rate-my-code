import loadEnvVars from "./config/env";
import accountRoutes from "./routes/account";
import feedbackRoutes from "./routes/feedback";
import postRouter from "./routes/post";

import express, { Request, Response, json } from "express";

loadEnvVars();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(json());

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Environment: ${process.env.NODE_ENV}\n`);
    console.log(`Server is running on port ${PORT}`);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello world! Server is running.",
    hostname: req.hostname,
  });
});

app.use("/api", [feedbackRoutes, accountRoutes, postRouter]);

export default app;
