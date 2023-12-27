import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    globals: true,
    coverage: {
      provider: "v8",
      exclude: ["**/tests/**"],
    },
  },
  plugins: [tsconfigPaths()],
});
