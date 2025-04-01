import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import esbuild from "esbuild";

esbuild
  .build({
    bundle: true,
    entryPoints: [
      "./source/devcontainer/inject-scripts.ts",
      "./source/devcontainer/rewrite-index.ts",
    ],
    format: "esm",
    outdir: "output/devcontainer",
    outExtension: { ".js": ".mjs" },
    packages: "external",
    platform: "node",
    target: "node22",
  })
  .catch(redirectErrorsToConsole(console));
