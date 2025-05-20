#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { redirectErrorsToStream } from "@oliversalzburg/js-utils/errors/stream.js";
import * as cheerio from "cheerio";

const main = async () => {
  const indexHtml = await readFile("index.html", { encoding: "utf8" });
  const injectables = readdirSync("overlay")
    .filter(_ => _.endsWith(".inject.js"))
    .map(_ => join("overlay", _));
  const $ = cheerio.load(indexHtml);

  // First script block is NewRelic
  $("script").first().remove();

  // Google stuff
  $("script[src='https://www.googletagmanager.com/gtag/js?id=G-0QBDX221PR'] + script").remove();
  $("script[src='https://www.googletagmanager.com/gtag/js?id=G-0QBDX221PR']").remove();

  // Remove Crowdjet (removed upstream. retained here for legacy support.)
  $("script[src='https://crowdin.com/js/crowdjet/crowdjet.js']").remove();
  $("#crowdjet-container").remove();
  $("#crowdjet-expand-container").remove();

  // Move all JS to external file.
  const cacheBreaker = "1494-8094d2a0f18a0987ea7f08a0cc0d0f50a755d15f";
  const indexJs = $("script:not([src])")
    .text()
    // 1494 is the base version of the game. 8094d2a0f18a0987ea7f08a0cc0d0f50a755d15f is a commit hash from this tree.
    .replaceAll(/Date.now\(\)/g, `"${cacheBreaker}"`);

  await writeFile("index.js", indexJs);

  $("script:not([src])").remove();
  $("html").append('<script type="text/javascript" src="index.js"></script>');

  process.stderr.write(`Injecting ${injectables.join(",")}...\n`);
  $("html").append(`<script type="text/javascript">
      const scripts = ${JSON.stringify(injectables)};
      for (const subject of scripts) {
        const script = document.createElement("script");
        script.src = subject + "?_=${cacheBreaker}";
        script.type = "text/javascript";
        document.body.appendChild(script);
      }
      </script>`);

  // Write result back to file.
  await writeFile("index.html", $.html());

  const httpServer = spawn("yarn", ["run", "watch-http-server", "-p", "8080"], { shell: true });
  httpServer.stdout.on("data", data => {
    process.stderr.write(`stdout: ${data}`);
  });

  httpServer.stderr.on("data", data => {
    process.stderr.write(`stderr: ${data}`);
  });

  httpServer.on("close", code => {
    process.stderr.write(`Child process exited with code ${code}. Exiting.\n`);
    process.exit(code);
  });

  for (const signal of ["SIGINT", "SIGTERM", "SIGQUIT"] as const) {
    process.on(signal, () => {
      httpServer.kill(signal);
      process.exit();
    });
  }
};

main().catch(redirectErrorsToStream(process.stderr));
