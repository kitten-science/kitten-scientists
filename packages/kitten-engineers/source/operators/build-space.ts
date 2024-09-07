import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import {
  Building,
  BuildingEffects,
  SpaceBuilding,
} from "@kitten-science/kitten-scientists/types/index.js";
import { coalesceArray, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { Operator } from "../GraphSolver.js";
import { effectToRequirement, effectToSolution } from "./build-bonfire.js";

export const BuildSpaceFactory = function* (items: Iterable<Building | SpaceBuilding>) {
  for (const item of items) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `build ${item}`;

      meta = mustExist(
        game.space.meta
          .find(m => m.meta.find(meta => meta.name === item))
          ?.meta.find(m => m.name === item),
      );
      requires = coalesceArray([
        ...this.meta.prices.map(price => price.name),
        ...Object.keys(this.meta.effects ?? {}).map(effect =>
          effectToRequirement(effect as keyof BuildingEffects),
        ),
        item === "spaceBeacon" ? ("relicStation" as const) : undefined,
        "solarRevolution" as const,
      ]);
      solves = coalesceArray([
        ...Object.keys(this.meta.effects ?? {}).map(effect =>
          effectToSolution(effect as keyof BuildingEffects),
        ),
        item,
        item === "spaceBeacon" ? ("relic" as const) : undefined,
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
