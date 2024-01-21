import { z } from "zod";

const envSchema = z.object({
  SECRET_KEY: z.string(),
  NODE_ENV: z.string().default("development"),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => Number(val)),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z
    .string()
    .default("6379")
    .transform((val) => Number(val)),
  DATABASE_URL: z.string(),
  MONGO_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
