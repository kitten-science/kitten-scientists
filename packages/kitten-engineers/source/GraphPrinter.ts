import { Operator } from "./GraphSolver.js";

export class GraphPrinter {
  print(node: Operator, seen = new Set<Operator>(), indent = 0) {
    if (10 < indent) {
      throw new Error("graph too deep");
    }

    if (seen.has(node)) {
      console.info(`${"  ".repeat(indent)}${node.name} ↻ loops back into graph`);
      return;
    }

    seen.add(node);

    if (0 < node.requires.length && node.children.size === 0) {
      console.warn(`${"  ".repeat(indent)}${node.name} 🗲 unsolved!`);
      return;
    }

    console.info(`${"  ".repeat(indent)}${node.name}`);

    if (node.requires.length === 0) {
      return;
    }

    const requirements = new Set(node.requires);
    for (const child of node.children) {
      this.print(child, seen, indent + 1);
      for (const solution of child.solves) {
        requirements.delete(solution);
      }
    }
    if (0 < requirements.size) {
      console.warn(
        `${"  ".repeat(indent)}🗲 parent was left partially unsolved: ${[...requirements.values()].join(", ")}`,
      );
    }
  }
}
