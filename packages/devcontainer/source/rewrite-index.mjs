import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import * as cheerio from "cheerio";
import { readFile, writeFile } from "fs/promises";

const main = async () => {
  const indexHtml = await readFile("index.html", { encoding: "utf8" });
  const $ = cheerio.load(indexHtml);

  // First script block is NewRelic
  $("script").first().remove();

  // Google stuff
  $("script[src='https://www.googletagmanager.com/gtag/js?id=G-0QBDX221PR'] + script").remove();
  $("script[src='https://www.googletagmanager.com/gtag/js?id=G-0QBDX221PR']").remove();

  // Remove Crowdjet
  $("script[src='https://crowdin.com/js/crowdjet/crowdjet.js']").remove();
  $("#crowdjet-container").remove();
  $("#crowdjet-expand-container").remove();

  // Move all JS to external file.
  const indexJs = $("script:not([src])")
    .text()
    .replaceAll(/Date.now\(\)/g, "1494");
  await writeFile("index.js", indexJs);
  $("script:not([src])").remove();
  $("html").append('<script type="text/javascript" src="index.js"></script>');

  // Write result back to file.
  await writeFile("index.html", $.html());
};

main().catch(redirectErrorsToConsole(console));
