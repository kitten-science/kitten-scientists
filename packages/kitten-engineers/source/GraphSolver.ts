import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import {
  Buildings,
  ChronoForgeUpgrades,
  Jobs,
  Policies,
  ReligionUpgrades,
  Resources,
  SpaceBuildings,
  StagedBuildings,
  Technologies,
  TranscendenceUpgrades,
  Upgrades,
  VoidSpaceUpgrades,
  ZiggurathUpgrades,
} from "@kitten-science/kitten-scientists/types/index.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { GraphJudge } from "./GraphJudge";

export const Solutions = [
  ...Buildings,
  ...ChronoForgeUpgrades,
  ...Jobs,
  ...Policies,
  ...ReligionUpgrades,
  ...Resources,
  ...SpaceBuildings,
  ...StagedBuildings,
  ...Technologies,
  ...TranscendenceUpgrades,
  ...Upgrades,
  ...VoidSpaceUpgrades,
  ...ZiggurathUpgrades,
  "energy",
  "epiphany",
  "happiness",
  "necrocornDeficit",
  "transcendenceTier",
  "worship",
] as const;
export type Solution = (typeof Solutions)[number];

export interface SnapshotCollection {
  buildings: PayloadBuildings;
}

export interface Operator extends TreeNode<Operator> {
  name: string;

  requires: Array<Solution>;
  solves: Array<Solution>;

  ancestors: Set<Operator>;

  scoreSolution: (
    solution: Solution,
    judge: GraphJudge<Operator>,
    _game: Game,
    state: EngineState,
    snapshots: SnapshotCollection,
  ) => number;
  execute: (game: Game, state: EngineState, snapshots: SnapshotCollection) => EngineState;
}

export class GraphSolver {
  operators: Iterable<Operator>;
  threshold: number;
  constructor(operators: Iterable<Operator>, threshold: number) {
    this.operators = operators;
    this.threshold = threshold;
  }

  solve(
    node: Operator,
    root: Operator = node,
    parents: Iterable<Operator> = [],
    depth = 0,
  ): Operator {
    if (depth > this.threshold) {
      return root;
    }

    for (const operator of this.operators) {
      // We might want to allow some operators to solve themselves,
      // but it seems counter-productive for the time being.
      if (operator === node) {
        continue;
      }
      if (!operator.solves.some(solution => node.requires.includes(solution))) {
        continue;
      }

      node.children.add(operator);

      if (root.ancestors.has(operator)) {
        continue;
      }

      for (const parent of parents) {
        parent.ancestors.add(operator);
      }

      root.ancestors.add(operator);
      this.solve(operator, root, [...parents, node], depth + 1);
    }

    return root;
  }
}
