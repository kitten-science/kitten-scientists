import { KittenScientists } from "@kitten-science/kitten-scientists/KittenScientists.js";
import { State } from "@kitten-science/kitten-scientists/state/State.js";
import { base64Encode } from "@oliversalzburg/js-utils/data/string.js";
import { InvalidArgumentError } from "@oliversalzburg/js-utils/errors/InvalidArgumentError.js";
import { PermissionViolationError } from "@oliversalzburg/js-utils/errors/PermissionViolationError.js";
import { decompressFromBase64 } from "lz-string";

export class StateLoader {
  static ALLOWED_PROTOCOLS = ["data:", "https:"];
  static ALLOWED_REMOTES = ["kitten-science.com"];

  async loadAnything(source: string) {
    let rootObject: unknown = null;

    // Interpret as URL
    try {
      const url = new URL(source);
      console.debug(`'${source}' parsed as a URL`);

      if (!StateLoader.ALLOWED_PROTOCOLS.includes(url.protocol)) {
        throw new PermissionViolationError(`Protocol '${url.protocol}' not allowed.`);
      }

      if (!StateLoader.ALLOWED_REMOTES.includes(url.host)) {
        throw new PermissionViolationError(`Remote '${url.host}' not allowed.`);
      }

      const response = await fetch(url);
      rootObject = await response.json();
    } catch (error) {
      if (error instanceof PermissionViolationError) {
        throw error;
      }
    }

    // Interpret as base64-encoded, lz-string compressed JSON
    if (rootObject === null) {
      try {
        const decompressed = decompressFromBase64(source);
        rootObject = KittenScientists.decodeSettings(decompressed);
      } catch (_error) {
        // Assuming `window.LZString is undefined`, as KS tried to decompress the input.
        // This is an indicator that the input wasn't a valid lz-string compressed JSON string in the first place.
      }
    }

    // Interpret as base64-encoded JSON
    if (rootObject === null) {
      try {
        rootObject = KittenScientists.decodeSettings(source);
      } catch (_error) {
        // Assuming `window.LZString is undefined`, as KS tried to decompress the input.
        // This is an indicator that the input could not be interpreted as a JSON string.
      }
    }

    // Interpret as JSON
    if (rootObject === null) {
      try {
        rootObject = JSON.parse(source) ?? null;
      } catch (_error) {
        // Assuming `unexpected character at line 1 column 1` or other parsing error.
        // This indicates that the input is not a valid JSON string.
      }
    }

    if (rootObject === null) {
      throw new InvalidArgumentError(
        `'${String(source).substring(0, 63)}' can not be interpreted as anything loadable.`,
      );
    }

    const rootObjectSerialized = JSON.stringify(rootObject);
    const rootObjectEncoded = base64Encode(rootObjectSerialized);
    const rootObjectDataUrl = `data:application/octet-stream;base64,${rootObjectEncoded}`;

    const state = new State(rootObjectDataUrl);
    const report = await state.loader.load();
    report.aggregate(console);

    await state.validate();
    return { engineState: state.merge(), engineStateRoot: state.state, state };
  }
}
