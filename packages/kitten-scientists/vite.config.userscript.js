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
const updateURL = `https://kitten-science.com/${
  isNightlyBuild ? "nightly.js" : isDevBuild ? "dev.js" : "stable.js"
}`;

const filename = ["kitten-scientists", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const KS_RELEASE_CHANNEL = JSON.stringify(process.env.KS_RELEASE_CHANNEL ?? "fixed");
const KS_VERSION = JSON.stringify(versionString);

export default defineConfig({
  plugins: [
    metablock({
      override: {
        version: versionString,
        description: manifest.description,
        homepage: manifest.homepage,
        supportURL: manifest.bugs.url,
        updateURL,
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
    KS_RELEASE_CHANNEL,
    KS_VERSION,
  },
});
