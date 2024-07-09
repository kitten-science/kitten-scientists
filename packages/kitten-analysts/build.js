import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import esbuild from "esbuild";

process.stdout.write("Building entrypoints...\n");

esbuild
  .build({
    bundle: true,
    entryPoints: ["./source/entrypoint-backend.ts", "./source/entrypoint-ui.ts"],
    external: ["node:*", "jsdom", "prom-client", "@koa/*", "koa*", "ws"],
    format: "esm",
    outdir: "./output/",
    packages: "bundle",
    platform: "node",
    target: "node22",
  })
  .then(() => process.stdout.write("Done\n"))
  .catch(redirectErrorsToConsole(console));
