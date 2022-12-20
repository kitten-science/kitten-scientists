import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" assert { type: "json" };

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

const filename = ["kitten-scientists", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  ""
);

const KG_SAVEGAME = process.env.KG_SAVEGAME ?? null;
const KS_SETTINGS = process.env.KS_SETTINGS ?? null;
const KS_VERSION = JSON.stringify(versionString);

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
      entry: "source/index.ts",
      name: "kitten-scientists",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
  },
  define: {
    KG_SAVEGAME,
    KS_SETTINGS,
    KS_VERSION,
  },
});
