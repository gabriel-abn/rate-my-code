import express, { Request, Response, json } from "express";
import { adaptRoute } from "./adapters/express-route-adapter";
import loadEnvVars from "./config/env";
import signInFactory from "./factories/account/sign-in-factory";

loadEnvVars();

const app = express();
const PORT = 3000;

app.use(json());

app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}\n`);
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/api/sign-in", adaptRoute(signInFactory.create()));

export default app;
