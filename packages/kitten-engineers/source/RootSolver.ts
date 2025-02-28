import type { Operator } from "./GraphSolver.js";
import { BuildHut } from "./examples/build-hut-operator.js";

export class RootSolver {
  solve(): Operator {
    return new BuildHut();
  }
}
