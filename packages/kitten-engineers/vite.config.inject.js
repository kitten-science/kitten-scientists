import { defineConfig } from "vite";

const filename = "kitten-engineers.inject.js";

export default defineConfig({
  build: {
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-engineers",
    },
    minify: false,
    outDir: "output",
    rollupOptions: {
      external: ["jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
    sourcemap: "inline",
  },
});
