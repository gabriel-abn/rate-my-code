import * as dotenv from "dotenv";
import path from "path";

const loadEnvVars = () => {
  let envPath = ".env";

  switch (process.env.NODE_ENV) {
    case "test":
      envPath = path.resolve(__dirname, "env", ".test.env");
      break;
    case "development":
      envPath = path.resolve(__dirname, "env", ".dev.env");
      break;
    case "production":
      envPath = path.resolve(__dirname, "env", ".prod.env");
      break;
    default:
      break;
  }

  dotenv.config({ path: envPath });
};

export default loadEnvVars;
