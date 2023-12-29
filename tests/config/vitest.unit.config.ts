import { mergeConfig } from "vitest/config";
import baseConfig from "../../vitest.config";

export default mergeConfig(baseConfig, {
  test: {
    include: ["**/*.spec.ts"],
    env: {
      NODE_ENV: "test",
    },
  },
});
