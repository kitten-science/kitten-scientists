import { UserScript } from "@kitten-science/kitten-scientists";
import { getDocumentElementTypeByIdStrict } from "@oliversalzburg/js-utils/dom/core.js";
import { decompressFromBase64 } from "lz-string";

const input = getDocumentElementTypeByIdStrict(document, "input", HTMLInputElement);
const parsed = getDocumentElementTypeByIdStrict(document, "parsed", HTMLTextAreaElement);

input.addEventListener("change", (event: Event) => {
  // Pre-decompress
  const decompressed = decompressFromBase64(input.value);
  parsed.value = JSON.stringify(UserScript.decodeSettings(decompressed), undefined, 2);
});
