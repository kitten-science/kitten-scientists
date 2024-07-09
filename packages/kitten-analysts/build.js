import { redirectErrorsToStream } from "@oliversalzburg/js-utils/errors/stream.js";
import esbuild from "esbuild";

process.stdout.write("Building Kitten Analysts entrypoints...\n");

esbuild
  .build({
    bundle: true,
    entryPoints: ["./source/entrypoint-backend.ts", "./source/entrypoint-ui.ts"],
    external: ["node:*", "jsdom", "prom-client", "@koa/*", "koa*", "ws"],
    format: "esm",
    outdir: "./output/",
    packages: "bundle",
    platform: "node",
    target: "esnext",
  })
  .then(() => process.stdout.write("Done building Kitten Analysts entrypoints.\n"))
  .catch(redirectErrorsToStream(process.stderr));
