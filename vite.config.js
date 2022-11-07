import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  root: "src",
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
