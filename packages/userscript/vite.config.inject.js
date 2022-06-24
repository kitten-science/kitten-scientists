import { defineConfig } from "vite";
import manifest from "./package.json" assert { type: "json" };

const isDevBuild = Boolean(process.env.DEV_BUILD);
const isNightlyBuild = Boolean(process.env.NIGHTLY_BUILD);

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
  isNightlyBuild ? `-${getDateString()}` : "",
  (isDevBuild || isNightlyBuild) && process.env.GITHUB_SHA
    ? `-${String(process.env.GITHUB_SHA).substring(0, 7)}`
    : "",
  ".user.js",
].join("");

const KG_SAVEGAME = process.env.KG_SAVEGAME ?? null;
const KS_SETTINGS = process.env.KS_SETTINGS ?? null;

export default defineConfig({
  build: {
    lib: {
      entry: "source/index.ts",
      name: "kitten-scientists",
    },
    minify: false,
    outDir: "output",
    rollupOptions: {
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
    sourcemap: "inline",
  },
  define: {
    KG_SAVEGAME,
    KS_SETTINGS,
  },
});
