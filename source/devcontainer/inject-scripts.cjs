#!/usr/bin/env node

const fs = require("node:fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
let injectedHtml = indexHtml.replace(
  "</body>",
  `<script>
    const scripts = [ "overlay/kitten-scientists.inject.js" ];

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
fs.writeFileSync("index.html", injectedHtml);
