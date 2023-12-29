import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    globals: true,
    globalSetup: "./src/main/config/env.ts",
    coverage: {
      provider: "v8",
      exclude: ["**/tests/**"],
    },
  },
  plugins: [tsconfigPaths()],
});
