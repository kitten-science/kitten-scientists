#!/usr/bin/env node

import { readFileSync } from "node:fs";

const getDateStringToday = (date = new Date()) => {
	const year = date.getUTCFullYear();
	const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
	const day = `${date.getUTCDate()}`.padStart(2, "0");
	return `${year}${month}${day}`;
};
const getDateStringNow = (date = new Date()) => {
	const hour = `${date.getUTCHours()}`.padStart(2, "0");
	const minute = `${date.getUTCMinutes()}`.padStart(2, "0");
	const second = `${date.getUTCSeconds()}`.padStart(2, "0");
	return `${getDateStringToday(date)}${hour}${minute}${second}`;
};

const manifestRaw = readFileSync("package.json", "utf8");
/** @type {{ version: string }} */
const manifest = JSON.parse(manifestRaw);

// Use this workaround until we have a solid version in the manifest.
const baseVersion = manifest.version.includes("-") ? "2.0.0" : manifest.version;

const tag = `preview.${getDateStringNow()}`;

process.stdout.write(`${baseVersion}-${tag}`);
