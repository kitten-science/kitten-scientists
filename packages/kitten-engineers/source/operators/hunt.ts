import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";

export class Hunt extends TreeNode<Operator> implements Operator {
  name = "hunt";

  requires = ["manpower" as const];
  solves = [
    "furs" as const,
    "ivory" as const,
    "unicorns" as const,
    "gold" as const,
    "bloodstone" as const,
  ];

  ancestors = new Set<Operator>();

  scoreSolution() {
    return 0.3;
  }

  execute(_game: Game, state: EngineState, _snapshots: { buildings: PayloadBuildings }) {
    return state;
  }
}
