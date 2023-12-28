import { defineConfig } from "vitest/config";
import * as baseConfig from "../../vitest.config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
  },
  ...baseConfig.default,
});
