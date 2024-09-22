import { NamedPalettes, Palette } from "@oliversalzburg/js-utils/graphics/palette.js";
import { GraphInfo } from "./GraphInfo.js";
import { Operator, Solution, Solutions } from "./GraphSolver.js";
import { Pause } from "./operators/pause.js";
import { Reset } from "./operators/reset.js";
import { UnlockSolarRevolution } from "./operators/unlock-solar-revolution.js";

const render = (node: Operator, color = 0xffffffff) => {
  const _hexColor = `"#${color.toString(16).padStart(8, "0")}"`;
  if (node instanceof UnlockSolarRevolution) {
    return `"${node.name}"`;
  }
  if (node instanceof Pause) {
    return `"${node.name}"`;
  }
  if (node instanceof Reset) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("assign")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("build")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("craft")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("research")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("take")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("trade")) {
    return `"${node.name}"`;
  }
  if (node.name.startsWith("unlock")) {
    return `"${node.name}"`;
  }

  return `"${node.name}"`;
};

export class GraphDotPrinter {
  palette = new Palette(NamedPalettes.Seaside);
  operatorColors = new Map<string, number>();

  print(
    node: Operator,
    info: GraphInfo,
    seen = new Set<Operator>(),
    indent = 0,
    dotBuffer = [
      "digraph kittens {",
      '    label="Kitten Engineers Decision Graph"',
      '    fontname="Helvetica,Arial,sans-serif"',
      "    layout=sfdp",
      "    splines=true",
      '    edge [fontname="Helvetica,Arial,sans-serif"]',
      '    node [fontname="Helvetica,Arial,sans-serif"]',
      "    graph [overlap=prism, overlap_scaling=5, overlap_shrink=true]",
    ],
  ): Array<string> {
    const limit = 150;
    if (limit < indent) {
      throw new Error(`Reached max recursion depth (${limit}) in graph.`);
    }

    if (seen.has(node)) {
      return dotBuffer;
    }

    seen.add(node);

    if (0 < node.requires.length && node.children.size === 0) {
      console.warn(`${node.name} 🗲 unsolved!`);
      return dotBuffer;
    }

    dotBuffer.push("    " + render(node, this.palette.someColor() >>> 0));

    if (node.requires.length === 0) {
      return dotBuffer;
    }

    const requirements = new Set(node.requires);
    for (const child of node.children) {
      this.print(child, info, seen, indent + 1, dotBuffer);
      dotBuffer.push(`    "${child.name}" -> "${node.name}"`);
      for (const solution of child.solves) {
        requirements.delete(solution);
      }
    }
    if (0 < requirements.size) {
      console.warn(
        `${"  ".repeat(indent)}🗲 parent was left partially unsolved: ${[...requirements.values()].join(", ")}`,
      );
    }

    return indent === 0 ? [...dotBuffer, "}"] : dotBuffer;
  }

  printEx(
    info: GraphInfo,
    dotBuffer = [
      "digraph kittens {",
      '    label="Kitten Engineers Decision Graph"',
      '    fontname="Helvetica,Arial,sans-serif"',
      "    layout=sfdp",
      "    splines=true",
      '    edge [fontname="Helvetica,Arial,sans-serif"]',
      '    node [fontname="Helvetica,Arial,sans-serif"]',
      "    graph [overlap=prism, overlap_scaling=5, overlap_shrink=true]",
    ],
  ): Array<string> {
    for (const node of info.nodes) {
      dotBuffer.push("    " + render(node, this.palette.someColor() >>> 0));
    }
    const edgeColors = new Map<Solution, string>(
      Solutions.map(solution => [
        solution,
        `#${(this.palette.someColor() >>> 0).toString(16).padStart(8, "0")}`,
      ]),
    );
    const coloredEdges = info.edges.sort((a, b) => a.solution.localeCompare(b.solution));
    for (const edge of coloredEdges) {
      dotBuffer.push(
        `    "${edge.nodes[0].name}" -> "${edge.nodes[1].name}" [color="${edgeColors.get(edge.solution)}"]`,
      );
    }

    return [...dotBuffer, "}"];
  }
}
