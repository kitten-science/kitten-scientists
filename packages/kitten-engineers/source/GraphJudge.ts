import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/index.js";
import { GraphInfo } from "./GraphInfo.js";
import { Operator, SnapshotCollection, Solution } from "./GraphSolver.js";

export class GraphJudge<TRoot extends Operator> {
  graphRoot: TRoot;
  graphInfo: GraphInfo;

  constructor(graphRoot: TRoot, graphInfo: GraphInfo) {
    this.graphRoot = graphRoot;
    this.graphInfo = graphInfo;
  }

  judge(
    node: TRoot | Operator = this.graphRoot,
    game: Game,
    state: EngineState,
    snapshots: SnapshotCollection,
  ): number {
    return node.scoreSolution(node.solves[0], this, game, state, snapshots);
  }

  judgeChildren(
    node: Operator,
    requirement: Solution,
    game: Game,
    state: EngineState,
    snapshots: SnapshotCollection,
  ): Array<number> {
    return [...node.children.values()]
      .filter(child => child.solves.includes(requirement))
      .map(child => child.scoreSolution(requirement, this, game, state, snapshots));
  }
}
