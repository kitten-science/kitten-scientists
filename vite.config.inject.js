import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import manifest from "./package.json" with { type: "json" };

const filename = "kitten-scientists.inject.js";

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(
	process.env.RELEASE_VERSION ?? `${manifest.version}-unstable`,
);

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: "source/entrypoint-inject.ts",
			formats: ["es"],
		},
		minify: false,
		outDir: "output",
		reportCompressedSize: false,
		rolldownOptions: {
			experimental: {
				attachDebugInfo: "none",
			},
			external: ["dojo", "jquery"],
			output: {
				comments: false,
				entryFileNames: filename,
				extend: true,
				format: "es",
				globals: { dojo: "dojo", jquery: "jquery" },
			},
		},
	},
	define: {
		RELEASE_CHANNEL,
		RELEASE_VERSION,
	},
	plugins: [
		cssInjectedByJsPlugin({
			attributes: {
				id: "ks-styles",
			},
			topExecutionPriority: false,
		}),
	],
});
