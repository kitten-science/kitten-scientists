import { chmod } from "node:fs/promises";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import esbuild from "esbuild";

esbuild
	.build({
		bundle: true,
		entryPoints: ["./devcontainer/entrypoint-devcontainer.ts"],
		format: "esm",
		outdir: "output",
		outExtension: { ".js": ".mjs" },
		packages: "external",
		platform: "node",
		target: "node22",
	})
	.then(() => chmod("output/entrypoint-devcontainer.mjs", 0o775))
	.catch(redirectErrorsToConsole(console));
