import "@kitten-science/kitten-analysts/KittenAnalysts.js";
import {
  type Game,
  type I18nEngine,
  Resources,
} from "@kitten-science/kitten-scientists/types/index.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { GraphPrinter } from "./GraphPrinter.js";
import { GraphSolver, type Operator } from "./GraphSolver.js";
import { AssignMiner } from "./examples/assign-miner-operator.js";
import { AssignWoodcutter } from "./examples/assign-woodcutter-operator.js";
import { BuildCatnipField } from "./examples/build-catnip-field-operator.js";
import { BuildHut } from "./examples/build-hut-operator.js";
import { BuildLogHouse } from "./examples/build-log-house-operator.js";
import { ConsumeStockResourceFactory } from "./examples/consume-stock-resource.js";
import { GatherCatnip } from "./examples/gather-catnip-operator.js";
import { RefineCatnip } from "./examples/refine-catnip-operator.js";
import { TradeLizards } from "./examples/trade-lizards-operator.js";
import { TradeNagas } from "./examples/trade-nagas-operator.js";
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
    cinfo("Kitten Engineers constructed.");

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

    return;

    // Build the list of available operators.
    const root = new BuildHut();
    const operators: Array<Operator> = [
      root,
      new AssignMiner(),
      new AssignWoodcutter(),
      new BuildCatnipField(),
      new BuildLogHouse(),
      new GatherCatnip(),
      new RefineCatnip(),
      new TradeLizards(),
      new TradeNagas(),
    ];

    for (const OperatorConstructor of ConsumeStockResourceFactory(Resources)) {
      operators.push(new OperatorConstructor());
    }

    const solver = new GraphSolver(operators);
    const graph = solver.solve(root);
    new GraphPrinter().print(graph);
  };
  savegameHandler = () => {
    /* intentionally left blank */
  };

  snapshot() {
    // Collect snapshot and apply rules
  }
}
