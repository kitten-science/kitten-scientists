import "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { Game, I18nEngine } from "@kitten-science/kitten-scientists/types/index.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { cinfo } from "./tools/Log.js";

declare global {
  interface Window {
    kittenEngineers?: KittenEngineers;
  }
}

export class KittenEngineers {
  readonly game: Game;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;
  #interval = -1;

  constructor(game: Game, i18nEngine: I18nEngine) {
    cinfo(`Kitten Engineers constructed.`);

    this.game = game;
    this.i18nEngine = i18nEngine;
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run() {
    this.start();
  }

  start() {
    if (this.#interval !== -1) {
      return;
    }

    document.addEventListener("ks.reportFrame", this.frameHandler);
    document.addEventListener("ks.reportSavegame", this.savegameHandler);

    this.#interval = window.setInterval(() => {
      this.snapshot();
    }, 5000);
  }

  stop() {
    if (this.#interval !== -1) {
      return;
    }

    document.removeEventListener("ks.reportFrame", this.frameHandler);
    document.removeEventListener("ks.reportSavegame", this.savegameHandler);

    window.clearInterval(this.#interval);
    this.#interval = -1;
  }

  frameHandler = () => {
    if (isNil(window.kittenScientists) || isNil(window.kittenAnalysts)) {
      return;
    }
    /* Disabled for the time being...
    foo(this.game, window.kittenScientists.engine.stateSerialize(), {
      buildings: mustExist(
        window.kittenAnalysts.processMessage({
          location: "internal://",
          responseId: "internal",
          type: "getBuildings",
        })?.data,
      ) as PayloadBuildings,
    });
    */
  };
  savegameHandler = () => {};

  snapshot() {
    // Collect snapshot and apply rules
  }
}
