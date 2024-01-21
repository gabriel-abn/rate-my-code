import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

import { config } from "dotenv";
import path from "path";

export default defineConfig({
  test: {
    env: {
      ...config({
        path: path.resolve(__dirname, "src", "main", "config", "env", ".test.env"),
      }).parsed,
      PORT: "0",
      NODE_ENV: "test",
    },
    passWithNoTests: true,
    globals: true,
    coverage: {
      provider: "v8",
      exclude: ["**/tests/**"],
    },
  },
  plugins: [tsconfigPaths()],
});
