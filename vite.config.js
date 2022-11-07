import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    glsl(),
    eslint({
      useEslintrc: false,
      overrideConfig: {
        parser: "@typescript-eslint/parser",
        plugins: ["prettier"],
        extends: ["eslint:recommended", "plugin:prettier/recommended"],
        env: {
            browser: true,
        }
      },
    }),
  ],
});
