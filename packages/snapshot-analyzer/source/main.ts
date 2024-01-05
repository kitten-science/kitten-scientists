import { UserScript } from "@kitten-science/kitten-scientists";
import { getDocumentElementTypeByIdStrict } from "@oliversalzburg/js-utils/dom/core.js";
import SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import { decompressFromBase64 } from "lz-string";

const input = getDocumentElementTypeByIdStrict(document, "input", SlInput);
const parsed = getDocumentElementTypeByIdStrict(document, "parsed", SlTextarea);

await Promise.all([
  customElements.whenDefined("sl-input"),
  customElements.whenDefined("sl-textarea"),
]);

input.addEventListener("sl-change", (event: Event) => {
  try {
    // Pre-decompress
    const decompressed = decompressFromBase64(input.value);
    parsed.value = JSON.stringify(UserScript.decodeSettings(decompressed), undefined, 2);
    input.setCustomValidity("");
  } catch (error) {
    console.debug(error);
    input.setCustomValidity("Invalid KS state");
  }
});
