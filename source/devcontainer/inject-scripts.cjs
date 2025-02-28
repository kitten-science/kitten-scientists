#!/usr/bin/env node

const fs = require("node:fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
let injectedHtml = indexHtml.replace(
  "</body>",
  `<script>
    const scripts = [
      // "kitten-analysts",
      // "kitten-engineers",
      "kitten-scientists"
    ];

    for (const subject of scripts) {
      const script = document.createElement("script");
      // Break caching through dynamic query parameter.
      script.src = subject + ".inject.js?t=" + new Date().valueOf();
      document.body.appendChild(script);
    }
  </script></body>`,
);
injectedHtml = injectedHtml.replace(
  /<title>.+<\/title>/,
  "<title>☣ Kitten Scientists Development Environment</title>",
);
fs.writeFileSync("index.html", injectedHtml);
