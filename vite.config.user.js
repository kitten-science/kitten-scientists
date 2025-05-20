import cleanup from "rollup-plugin-cleanup";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const minify = Boolean(process.env.MINIFY);
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["kitten-scientists", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL ?? "fixed";
const RELEASE_VERSION = versionString;

const downloadURL = `https://kitten-science.com/${RELEASE_CHANNEL}.js`;
const updateURL = `https://kitten-science.com/${RELEASE_CHANNEL}.min.js`;

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-scientists",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        entryFileNames: filename,
        extend: true,
        format: "umd",
      },
      plugins: [cleanup({ comments: "none", extensions: ["js", "ts"] })],
    },
    sourcemap: "hidden",
  },
  define: {
    RELEASE_CHANNEL: JSON.stringify(RELEASE_CHANNEL),
    RELEASE_VERSION: JSON.stringify(RELEASE_VERSION),
  },
  plugins: [
    cssInjectedByJsPlugin({ styleId: "ks-styles", topExecutionPriority: false }),
    {
      ...metablock({
        override: {
          description: manifest.description,
          downloadURL,
          homepageURL: manifest.homepage,
          updateURL,
          version: versionString,
        },
      }),
      enforce: "post",
    },
  ],
});
