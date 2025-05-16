import { readFile, writeFile } from "node:fs/promises";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import * as cheerio from "cheerio";

const main = async () => {
  const indexHtml = await readFile("index.html", { encoding: "utf8" });
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
  const indexJs = $("script:not([src])")
    .text()
    // 1494 is the base version of the game. fb07a6718893e6e1039c9ee77ecb388b1da3600a is a commit hash from this tree.
    .replaceAll(/Date.now\(\)/g, "1494-fb07a6718893e6e1039c9ee77ecb388b1da3600a");

  await writeFile("index.js", indexJs);

  $("script:not([src])").remove();
  $("html").append('<script type="text/javascript" src="index.js"></script>');

  // Write result back to file.
  await writeFile("index.html", $.html());
};

main().catch(redirectErrorsToConsole(console));
