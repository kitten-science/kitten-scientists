import { Operator, Solution } from "./GraphSolver.js";

export interface GraphEdge {
  nodes: [Operator, Operator];
  solution: Solution;
}

export interface GraphInfo {
  nodes: Array<Operator>;
  edges: Array<GraphEdge>;
}

export const analyzeGraph = (root: Operator): GraphInfo => {
  const collectNodes = (node: Operator, log = new Set<Operator>()): Array<Operator> => {
    log.add(node);
    return [
      node,
      ...[...node.children.values()].flatMap(child =>
        log.has(child) ? [] : collectNodes(child, log),
      ),
    ];
  };
  const collectEdges = (node: Operator, log = new Set<Operator>()): Array<GraphEdge> => {
    log.add(node);
    return [
      ...node.requires
        .map((requirement): [Solution, Array<Operator>] => [
          requirement,
          [...node.children.values()].filter(child => child.solves.includes(requirement)),
        ])
        .flatMap(([requirement, solutions]) => {
          return solutions.map(
            (solution): GraphEdge => ({
              nodes: [node, solution],
              solution: requirement,
            }),
          );
        }),
      ...[...node.children.values()].flatMap(child =>
        log.has(child) ? [] : collectEdges(child, log),
      ),
    ];
  };

  return {
    nodes: collectNodes(root),
    edges: collectEdges(root),
  };
};
