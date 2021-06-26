#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
let injectedHtml = indexHtml.replace("</body>", "<script src=\"kitten-scientists.inject.js\"></script></body>");
injectedHtml = injectedHtml.replace(/<title>.+<\/title>/, "<title>☣ Kitten Scientists Development Environment</title>");
fs.writeFileSync("index.html", injectedHtml);
