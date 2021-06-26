#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
indexHtml.replace("</body>", "<script src=\"kitten-scientists.inject.js\"></script></body>");
fs.writeFileSync("index.html", indexHtml);
