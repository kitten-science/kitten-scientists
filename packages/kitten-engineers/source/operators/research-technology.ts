import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { Technology } from "@kitten-science/kitten-scientists/types/index.js";
import { coalesceArray, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";

export const ResearchTechnologyFactory = function* (items: Iterable<Technology>) {
  for (const item of items) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `research ${item}`;

      meta = mustExist(game.science.techs.find(tech => tech.name === item));
      requires = this.meta.prices.map(price => price.name);
      solves = coalesceArray([
        ...(this.meta.unlocks?.buildings ?? []),
        ...(this.meta.unlocks?.chronoforge ?? []),
        ...(this.meta.unlocks?.crafts ?? []),
        ...(this.meta.unlocks?.jobs ?? []),
        ...(this.meta.unlocks?.policies ?? []),
        ...(this.meta.unlocks?.stages ?? []),
        ...(this.meta.unlocks?.tech ?? []),
        ...(this.meta.unlocks?.upgrades ?? []),
        ...(this.meta.unlocks?.voidSpace ?? []),
        item,
      ]);

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
