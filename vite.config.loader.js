import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const minify = Boolean(process.env.MINIFY) ?? !isDevBuild;
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["kitten-scientists", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL ?? "fixed";
const USE_DEV_PAYLOAD = false;

const downloadURL = `https://kitten-science.com/${RELEASE_CHANNEL}.js`;
const updateURL = `https://kitten-science.com/${RELEASE_CHANNEL}.min.js`;

const PAYLOAD = JSON.stringify(
  readFileSync(
    USE_DEV_PAYLOAD
      ? "./output/kitten-scientists.inject.js"
      : "./output/kitten-scientists.min.inject.js",
    "utf-8",
  ),
);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-loader.ts",
      name: "kitten-scientists",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      output: {
        entryFileNames: filename,
        extend: true,
        format: "umd",
      },
    },
    sourcemap: "hidden",
  },
  define: {
    PAYLOAD,
  },
  plugins: [
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
    },
  ],
});
