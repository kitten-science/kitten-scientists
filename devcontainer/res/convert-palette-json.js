import { readFileSync } from "node:fs";

const inputText = readFileSync("pal.md", "utf8");
const lines = inputText.split(/\n/);

const palette = new Map();
for (const line of lines.sort()) {
  const matches = line.match(/- #([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2}) (.*)$/);
  if (matches === null) {
    continue;
  }
  const color = 3 <= matches.length ? [matches[1], matches[2], matches[3]] : ["FF", "C0", "CB"];
  const colorString = color.join("");
  if (!palette.has(colorString)) {
    palette.set(colorString, []);
  }
  const paletteEntry = palette.get(colorString);

  const label = 4 <= matches.length ? matches[4] : "<palette conversion error>";
  const labelParts = label.match(/^(?:(\([^(]+?\)) )?- (.+)/);
  paletteEntry.push({
    cssNote: labelParts[1] ?? "",
    usageNote: labelParts[2],
  });
}

const hash = {};
for (const [colorString, entries] of palette) {
  hash[colorString] = entries;
}

console.log(JSON.stringify(hash, undefined, "\t"));
