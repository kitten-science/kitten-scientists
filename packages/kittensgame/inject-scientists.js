#!/usr/bin/env node
const fs = require("fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
let injectedHtml = indexHtml.replace(
  "</body>",
  `<script>
    const script = document.createElement("script");
    // Break caching through dynamic query parameter.
    script.src = "kitten-scientists/kitten-scientists.inject.js?t=" + new Date().valueOf();
    document.body.appendChild(script);
  </script></body>`,
);
injectedHtml = injectedHtml.replace(
  /<title>.+<\/title>/,
  "<title>☣ Kitten Scientists Development Environment</title>",
);
fs.writeFileSync("index.html", injectedHtml);
