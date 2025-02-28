import type { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import type { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import type { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import type { Operator, Solution } from "../GraphSolver.js";

export class BuildLogHouse extends TreeNode<Operator> implements Operator {
  name = "build log house";

  requires: Array<Solution> = ["minerals", "wood"];
  solves: Array<Solution> = ["kittens"];

  ancestors = new Set<Operator>();

  calculateCost() {
    return 0;
  }

  execute(_game: Game, state: EngineState, _snapshots: { buildings: PayloadBuildings }) {
    return state;
  }
}
