import cleanup from "rollup-plugin-cleanup";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const minify = Boolean(process.env.MINIFY) ?? !isDevBuild;
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["kitten-scientists", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(versionString);

const updateURL = `https://kitten-science.com/${RELEASE_CHANNEL}.js`;

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
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
      plugins: [cleanup({ comments: "none", extensions: ["js", "ts"] })],
    },
  },
  define: {
    RELEASE_CHANNEL,
    RELEASE_VERSION,
  },
  plugins: [
    cssInjectedByJsPlugin({ styleId: "ks-styles", topExecutionPriority: false }),
    {
      ...metablock({
        override: {
          version: versionString,
          description: manifest.description,
          homepage: manifest.homepage,
          supportURL: manifest.bugs.url,
          updateURL,
        },
      }),
      enforce: "post",
    },
  ],
});
