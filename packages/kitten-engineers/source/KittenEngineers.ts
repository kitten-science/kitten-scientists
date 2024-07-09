import { cinfo, Game, I18nEngine } from "@kitten-science/kitten-scientists";

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

    this.#interval = window.setInterval(() => {
      this.snapshot();
    }, 5000);
  }
  stop() {
    window.clearInterval(this.#interval);
    this.#interval = -1;
  }

  snapshot() {
    // Collect snapshot and apply rules
  }
}
