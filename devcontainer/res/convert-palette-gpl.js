import { readFileSync } from "node:fs";

const inputText = readFileSync("pal.md", "utf8");
const lines = inputText.split(/\n/);

let previous = "";
for (const line of lines.sort()) {
  const matches = line.match(/- #([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2}) (.*)$/);
  if (matches === null) {
    continue;
  }
  const color = 3 <= matches.length ? [matches[1], matches[2], matches[3]] : ["FF", "C0", "CB"];
  const colorString = color.join();
  if (colorString === previous) {
    continue;
  }
  previous = colorString;
  const label = 4 <= matches.length ? matches[4] : "<palette conversion error>";
  const clean = label.split("-")[1].trim();
  const value = color.map(component => Number.parseInt(component, 16));
  const entry = `${value[0].toString(10).padStart(3, " ")} ${value[1].toString(10).padStart(3, " ")} ${value[2].toString(10).padStart(3, " ")}    ${clean}`;
  console.log(entry);
}
