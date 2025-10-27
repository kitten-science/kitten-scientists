import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import manifest from "./package.json" with { type: "json" };

const MINIFY = Boolean(process.env.MINIFY);

const filename = ["kitten-scientists", MINIFY ? ".min" : "", ".inject.js"].join("");

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(process.env.RELEASE_VERSION ?? `${manifest.version}-live`);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-inject.ts",
      name: "kitten-scientists",
    },
    minify: MINIFY ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        entryFileNames: filename,
        extend: true,
        format: "esm",
      },
    },
    sourcemap: "hidden",
    target: "esnext",
  },
  define: {
    RELEASE_CHANNEL,
    RELEASE_VERSION,
  },
  plugins: [cssInjectedByJsPlugin({ styleId: "ks-styles", topExecutionPriority: false })],
});
