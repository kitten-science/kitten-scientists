import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const filename = [
	"kitten-scientists",
	process.env.RELEASE_VERSION_FILENAME
		? `-${process.env.RELEASE_VERSION_FILENAME}`
		: "",
	".user.js",
].join("");

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL ?? "fixed";

const downloadURL = `https://kitten-science.com/${RELEASE_CHANNEL}.js`;

const PAYLOAD = JSON.stringify(
	readFileSync("./output/kitten-scientists.inject.js", "utf-8"),
);

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: "source/entrypoint-loader.ts",
			name: "kitten-scientists",
		},
		minify: false,
		outDir: "output",
		rolldownOptions: {
			output: {
				entryFileNames: filename,
				extend: true,
				format: "umd",
			},
		},
		sourcemap: false,
	},
	define: {
		PAYLOAD,
	},
	plugins: [
		{
			...metablock({
				override: {
					description: manifest.description,
					downloadURL,
					homepageURL: manifest.homepage,
					version: process.env.RELEASE_VERSION
						? process.env.RELEASE_VERSION
						: manifest.version,
				},
			}),
		},
	],
});
