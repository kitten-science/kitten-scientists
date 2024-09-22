import "@kitten-science/kitten-analysts/KittenAnalysts.js";
import {
  Buildings,
  ChronoForgeUpgrades,
  Game,
  I18nEngine,
  ReligionUpgrades,
  Resources,
  ResourcesCraftable,
  SpaceBuildings,
  Technologies,
  TranscendenceUpgrades,
  Upgrades,
  VoidSpaceUpgrades,
  ZiggurathUpgrades,
} from "@kitten-science/kitten-scientists/types/index.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { GraphDotPrinter } from "./GraphDotPrinter.js";
import { analyzeGraph } from "./GraphInfo.js";
import { GraphJudge } from "./GraphJudge.js";
import { GraphSolver, Operator } from "./GraphSolver.js";
import { Adore } from "./operators/adore.js";
import { AssignFarmer } from "./operators/assign-farmer.js";
import { AssignGeologist } from "./operators/assign-geologist.js";
import { AssignHunter } from "./operators/assign-hunter.js";
import { AssignMiner } from "./operators/assign-miner.js";
import { AssignPriest } from "./operators/assign-priest.js";
import { AssignScholar } from "./operators/assign-scholar.js";
import { AssignWoodcutter } from "./operators/assign-woodcutter.js";
import { BuildBonfireFactory } from "./operators/build-bonfire.js";
import { BuildReligionFactory } from "./operators/build-religion.js";
import { BuildSpaceFactory } from "./operators/build-space.js";
import { BuildTimeFactory } from "./operators/build-time.js";
import { ConsumeStockResourceFactory } from "./operators/consume-stock-resource.js";
import { CraftFactory } from "./operators/craft.js";
import { GatherCatnip } from "./operators/gather-catnip.js";
import { Hunt } from "./operators/hunt.js";
import { Pause } from "./operators/pause.js";
import { Praise } from "./operators/praise.js";
import { RefineCatnip } from "./operators/refine-catnip.js";
import { ResearchTechnologyFactory } from "./operators/research-technology.js";
import { Reset } from "./operators/reset.js";
import { SacrificeUnicorns } from "./operators/sacrifice-unicorns.js";
import { TradeDragons } from "./operators/trade-dragons.js";
import { TradeGriffins } from "./operators/trade-griffins.js";
import { TradeLeviathans } from "./operators/trade-leviathans.js";
import { TradeLizards } from "./operators/trade-lizards.js";
import { TradeNagas } from "./operators/trade-nagas.js";
import { TradeSharks } from "./operators/trade-sharks.js";
import { TradeSpiders } from "./operators/trade-spiders.js";
import { TradeZebras } from "./operators/trade-zebras.js";
import { Transcend } from "./operators/transcend.js";
import { UnlockSolarRevolution } from "./operators/unlock-solar-revolution.js";
import { UnlockUpgradeFactory } from "./operators/unlock-upgrade.js";
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

    // Build the list of available operators.
    //const root = new ResetWithChronospheres();
    const root = new UnlockSolarRevolution();
    const operators: Array<Operator> = [
      new Adore(),
      new AssignFarmer(),
      new AssignGeologist(),
      new AssignHunter(),
      new AssignMiner(),
      new AssignPriest(),
      new AssignScholar(),
      new AssignWoodcutter(),
      new GatherCatnip(),
      new Hunt(),
      new Pause(),
      new Praise(),
      new RefineCatnip(),
      new Reset(),
      new SacrificeUnicorns(),
      new TradeDragons(),
      new TradeGriffins(),
      new TradeLeviathans(),
      new TradeLizards(),
      new TradeNagas(),
      new TradeSharks(),
      new TradeSpiders(),
      new TradeZebras(),
      new Transcend(),
    ];

    for (const OperatorConstructor of BuildBonfireFactory(Buildings)) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of BuildReligionFactory([
      ...ReligionUpgrades,
      ...TranscendenceUpgrades,
      ...ZiggurathUpgrades,
    ])) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of BuildSpaceFactory(SpaceBuildings)) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of BuildTimeFactory([
      ...ChronoForgeUpgrades,
      ...VoidSpaceUpgrades,
    ])) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of ConsumeStockResourceFactory(Resources)) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of CraftFactory(ResourcesCraftable)) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of ResearchTechnologyFactory(Technologies)) {
      operators.push(new OperatorConstructor());
    }
    for (const OperatorConstructor of UnlockUpgradeFactory(Upgrades)) {
      operators.push(new OperatorConstructor());
    }

    const solver = new GraphSolver(operators, 2);
    const graph = solver.solve(root);
    const info = analyzeGraph(graph);
    const dotGraph = new GraphDotPrinter().printEx(info);
    const _judgement = new GraphJudge(graph, info).judge(
      graph,
      this.game,
      window.kittenScientists?.engine,
      {},
    );
    console.log(dotGraph.join("\n"));
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
  };
  savegameHandler = () => {};
}
