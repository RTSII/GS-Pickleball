import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    environment: "node",
  },
});
