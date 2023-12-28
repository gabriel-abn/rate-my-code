import { defineConfig } from "vitest/config";
import * as baseConfig from "../../vitest.config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
  },
  ...baseConfig.default,
});
