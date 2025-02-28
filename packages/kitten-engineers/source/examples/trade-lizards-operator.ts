import type { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import type { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import type { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import type { Operator } from "../GraphSolver.js";
import { cdebug } from "../tools/Log.js";

export class TradeLizards extends TreeNode<Operator> implements Operator {
  name = "trade with lizards";

  requires = ["minerals" as const];
  solves = ["beam" as const, "scaffold" as const, "wood" as const];

  ancestors = new Set<Operator>();

  calculateCost() {
    return 0;
  }

  execute(_game: Game, state: EngineState, snapshots: { buildings: PayloadBuildings }) {
    cdebug(
      "Solar Revolution is currently at value:",
      snapshots.buildings.find(b => b.name === "solarRevolution")?.value,
    );
    return state;
  }
}
