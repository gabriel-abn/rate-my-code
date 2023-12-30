import loadEnvVars from "./config/env";
import { accountRoutes } from "./routes";

import express, { Request, Response, json } from "express";

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

app.use("/api", [accountRoutes]);

export default app;
