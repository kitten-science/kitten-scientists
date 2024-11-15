import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import manifest from "./package.json" with { type: "json" };

const filename = "kitten-scientists.inject.js";

const KS_RELEASE_CHANNEL = JSON.stringify(process.env.KS_RELEASE_CHANNEL ?? "fixed");
const KS_VERSION = JSON.stringify(process.env.RELEASE_VERSION ?? `${manifest.version}-live`);

export default defineConfig({
  build: {
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-scientists",
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
  define: {
    KS_RELEASE_CHANNEL,
    KS_VERSION,
  },
  plugins: [cssInjectedByJsPlugin()],
});
