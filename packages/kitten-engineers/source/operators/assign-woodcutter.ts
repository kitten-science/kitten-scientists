import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";
import { cdebug } from "../tools/Log.js";

export class AssignWoodcutter extends TreeNode<Operator> implements Operator {
  name = "assign woodcutter";

  requires = ["kittens" as const];
  solves = ["wood" as const];

  ancestors = new Set<Operator>();

  scoreSolution() {
    return 0.3;
  }

  execute(_game: Game, state: EngineState, snapshots: { buildings: PayloadBuildings }) {
    cdebug(
      "Solar Revolution is currently at value:",
      snapshots.buildings.find(b => b.name === "solarRevolution")?.value,
    );
    return state;
  }
}
