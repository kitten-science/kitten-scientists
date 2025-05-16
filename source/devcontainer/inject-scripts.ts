#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const indexHtml = readFileSync("index.html", "utf8");
const injectables = readdirSync("overlay").map(_ => _.endsWith(".inject.js"));
const injectedHtml = indexHtml.replace(
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
writeFileSync("index.html", injectedHtml);
