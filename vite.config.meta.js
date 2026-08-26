import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const filenameUserscript = "kitten-scientists.user.js";
const filenameMeta = "kitten-scientists.meta.js";

const downloadURL = `https://kitten-science.com/${filenameUserscript}`;
const metaURL = `https://kitten-science.com/${filenameMeta}`;

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: "source/entrypoint-meta.ts",
			formats: ["es"],
		},
		outDir: "output",
		reportCompressedSize: false,
		rolldownOptions: {
			experimental: {
				attachDebugInfo: "none",
			},
			output: {
				entryFileNames: filenameMeta,
				extend: true,
				format: "es",
			},
		},
	},
	plugins: [
		metablock({
			applyTo: filenameMeta,
			override: {
				description: manifest.description,
				downloadURL,
				homepageURL: manifest.homepage,
				updateURL: metaURL,
				version: process.env.RELEASE_VERSION
					? process.env.RELEASE_VERSION
					: manifest.version,
			},
		}),
	],
});
