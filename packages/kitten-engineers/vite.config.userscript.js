import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const isCi = Boolean(process.env.CI);
const isDevBuild = String(process.env.DEV_BUILD) === "true";
const isNightlyBuild = String(process.env.NIGHTLY_BUILD) === "true";
const minify = Boolean(process.env.MINIFY) ?? !isDevBuild;

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

const versionString = [
  manifest.version,
  isDevBuild ? "-dev" : "",
  isNightlyBuild ? `-${getDateString()}` : "",
  (isDevBuild || isNightlyBuild) && process.env.GITHUB_SHA
    ? `-${String(process.env.GITHUB_SHA).substring(0, 7)}`
    : "",
].join("");

const filename = ["kitten-engineers", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

export default defineConfig({
  plugins: [
    metablock({
      override: {
        version: versionString,
        description: manifest.description,
        homepage: manifest.homepage,
        supportURL: manifest.bugs.url,
      },
    }),
  ],
  build: {
    emptyOutDir: !isCi,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-engineers",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
  },
});
