import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  base: "/snapshot-analyzer/",
  root: "source",
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [createHtmlPlugin()],
});
