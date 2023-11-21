import { writeFileSync } from "fs";
import { State } from "../../packages/kitten-scientists/build/state/State.js";

const entry = performance.now();

const state = new State(
  "https://raw.githubusercontent.com/kitten-science/kitten-scientists/389735c07a0bc73fbeecec3a97a657cd879ff1e0/presets/experiment.json",
);

const profile = await state.resolve();
profile.report.aggregateLog();

const engineState = state.merge();
writeFileSync("load-profile.result.json", JSON.stringify(engineState, undefined, 2));
console.info("Result written to 'load-profile.result.json'.");

const exit = performance.now();
console.log(`Took ${Math.round(exit - entry)}ms.`);
