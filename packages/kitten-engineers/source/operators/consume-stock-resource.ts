import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { Resource } from "@kitten-science/kitten-scientists/types/index.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";

export const ConsumeStockResourceFactory = function* (resources: Iterable<Resource>) {
  for (const resource of resources) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `take ${resource} from stock`;

      requires = [resource];
      solves = [resource];

      ancestors = new Set<Operator>();

      scoreSolution() {
        return 0;
      }

      execute(_game: Game, state: EngineState, _snapshots: { buildings: PayloadBuildings }) {
        return state;
      }
    };
  }
};
