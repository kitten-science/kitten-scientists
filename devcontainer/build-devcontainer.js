import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import esbuild from "esbuild";

esbuild
  .build({
    bundle: true,
    entryPoints: [
      "./source/devcontainer/inject-scripts.cjs",
      "./source/devcontainer/rewrite-index.mjs",
    ],
    external: ["os"],
    format: "esm",
    inject: ["source/devcontainer/cjs-shim.ts"],
    outdir: "output/devcontainer",
    outExtension: { ".js": ".mjs" },
    platform: "node",
    target: "node22",
  })
  .catch(redirectErrorsToConsole(console));
