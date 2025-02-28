import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import esbuild from "esbuild";

esbuild
  .build({
    bundle: true,
    entryPoints: ["./source/inject-scripts.cjs", "./source/rewrite-index.mjs"],
    external: ["os"],
    format: "esm",
    inject: ["source/cjs-shim.ts"],
    outdir: "./output",
    outExtension: { ".js": ".mjs" },
    platform: "node",
    target: "node22",
  })
  .catch(redirectErrorsToConsole(console));
