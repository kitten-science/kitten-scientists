import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" assert { type: "json" };

const isDevBuild = process.env.NODE_ENV === "development";

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

const filename = [
  "kitten-scientists",
  isDevBuild ? "-dev" : `-${manifest.version}`,
  process.env.NIGHTLY_BUILD ? `-${getDateString()}` : "",
  process.env.GITHUB_SHA ? `-${String(process.env.GITHUB_SHA).substring(0, 7)}` : "",
  ".user.js",
].join("");

export default defineConfig({
  plugins: [
    metablock({
      override: {
        version: manifest.version,
        description: manifest.description,
        homepage: manifest.homepage,
        supportURL: manifest.bugs.url,
      },
    }),
  ],
  build: {
    lib: {
      entry: "source/index.ts",
      name: "kitten-scientists",
    },
    minify: isDevBuild ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
  },
});
