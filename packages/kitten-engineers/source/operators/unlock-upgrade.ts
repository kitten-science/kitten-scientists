import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { BuildingEffects, Upgrade } from "@kitten-science/kitten-scientists/types/index.js";
import { coalesceArray, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";
import { effectToRequirement, effectToSolution } from "./build-bonfire.js";

export const UnlockUpgradeFactory = function* (items: Iterable<Upgrade>) {
  for (const item of items) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `unlock ${item}`;

      meta = mustExist(game.workshop.upgrades.find(meta => meta.name === item));
      requires = coalesceArray([
        ...mustExist(game.workshop.upgrades.find(tech => tech.name === item)).prices.map(
          price => price.name,
        ),
        ...Object.keys(this.meta.effects ?? {}).map(effect =>
          effectToRequirement(effect as keyof BuildingEffects),
        ),
      ]);
      solves = coalesceArray([
        ...Object.keys(this.meta.effects ?? {}).map(effect =>
          effectToSolution(effect as keyof BuildingEffects),
        ),
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
