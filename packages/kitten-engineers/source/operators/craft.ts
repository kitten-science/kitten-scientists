import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { ResourceCraftable } from "@kitten-science/kitten-scientists/types/index.js";
import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";

export const CraftFactory = function* (crafts: Iterable<ResourceCraftable>) {
  for (const craft of crafts) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `craft ${craft}`;

      requires = mustExist(game.workshop.crafts.find(item => item.name === craft)).prices.map(
        price => price.name,
      );
      solves = [craft];

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
