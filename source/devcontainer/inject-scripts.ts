#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";

const indexHtml = readFileSync("index.html", "utf8");
const injectables = process.argv.slice(2);
let injectedHtml = indexHtml.replace(
  "</body>",
  `<script>
    const scripts = ${JSON.stringify(injectables)};
    for (const subject of scripts) {
      const script = document.createElement("script");
      script.src = subject + "?_=" + new Date().getTime();
      document.body.appendChild(script);
    }
  </script></body>`,
);
injectedHtml = injectedHtml.replace(
  /<title>.+<\/title>/,
  "<title>☣ Kitten Scientists Development Environment</title>",
);
writeFileSync("index.html", injectedHtml);
