import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { GraphJudge } from "../GraphJudge.js";
import { Operator, SnapshotCollection, Solution } from "../GraphSolver.js";
import { priceArrayToRecord } from "../tools/Prices.js";

export class UnlockSolarRevolution extends TreeNode<Operator> implements Operator {
  name = "unlock solarRevolution";

  requires = ["faith" as const, "gold" as const];
  solves = ["solarRevolution" as const];

  ancestors = new Set<Operator>();

  scoreSolution(
    _solution: Solution,
    judge: GraphJudge<Operator>,
    game: Game,
    state: EngineState,
    snapshots: SnapshotCollection,
  ): number {
    const solarRevolution = mustExist(
      snapshots.buildings.find(entity => entity.name === "solarRevolution"),
    );

    // Already unlocked? Nothing to do.
    if (solarRevolution.value === 1) {
      return 0;
    }

    const prices = priceArrayToRecord(mustExist(game.religion.getRU("solarRevolution")?.prices));
    return this.requires
      .map(
        requirement =>
          judge.judgeChildren(this, requirement, game, state, snapshots).sort()[0] *
          mustExist(prices[requirement]).val,
      )
      .reduce((score, childScore) => score + childScore, 0);
  }

  execute(_game: Game, state: EngineState, _snapshots: SnapshotCollection) {
    return state;
  }
}
