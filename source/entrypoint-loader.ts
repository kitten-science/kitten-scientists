import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";

declare global {
  const PAYLOAD: string;
}

(async () => {
  const existingLoader = document.querySelector("#ks-loader-singleton");
  if (!isNil(existingLoader)) {
    throw new InvalidOperationError(
      "The Kitten Science script loader was already created. This is unexpected.",
    );
  }

  if (typeof GM !== "undefined") {
    const nodeScript = document.createElement("script");
    nodeScript.id = "ks-loader-singleton";
    nodeScript.textContent = PAYLOAD;
    nodeScript.type = "application/javascript";
    document.body.appendChild(nodeScript);
  }
})().catch(redirectErrorsToConsole(console));
