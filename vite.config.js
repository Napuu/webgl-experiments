import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  root: "src",
  build: {
    rollupOptions: {
      input: {
        particles1: resolve(__dirname, "src/particles1/index.html"),
        main: resolve(__dirname, "src/index.html"),
      },
    },
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
  },
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
