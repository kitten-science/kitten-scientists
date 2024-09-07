import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { Buildings, Resources } from "@kitten-science/kitten-scientists/types/index.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";

export const Solutions = [...Buildings, ...Resources] as const;
export type Solution = (typeof Solutions)[number];

export interface Operator extends TreeNode<Operator> {
  name: string;

  requires: Array<Solution>;
  solves: Array<Solution>;

  ancestors: Set<Operator>;

  calculateCost: () => number;
  execute: (
    game: Game,
    state: EngineState,
    snapshots: { buildings: PayloadBuildings },
  ) => EngineState;
}

export class GraphSolver {
  operators: Iterable<Operator>;
  constructor(operators: Iterable<Operator>) {
    this.operators = operators;
  }

  solve(node: Operator, root: Operator = node, parents: Iterable<Operator> = []): Operator {
    for (const operator of this.operators) {
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
      this.solve(operator, root, [...parents, node]);
    }

    return root;
  }
}
