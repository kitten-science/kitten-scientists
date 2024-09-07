import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";

export class TradeSharks extends TreeNode<Operator> implements Operator {
  name = "trade with sharks";

  requires = ["iron" as const];
  solves = [
    "catnip" as const,
    "parchment" as const,
    "manuscript" as const,
    "compedium" as const,
    "blueprint" as const,
    "spice" as const,
  ];

  ancestors = new Set<Operator>();

  scoreSolution() {
    return 0;
  }

  execute(_game: Game, state: EngineState, _snapshots: { buildings: PayloadBuildings }) {
    return state;
  }
}
