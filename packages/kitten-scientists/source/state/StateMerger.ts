import { mustExist } from "@oliversalzburg/js-utils/nil.js";
import { deepMergeLeft } from "../tools/Entries.js";
import { State } from "./State.js";

export class StateMerger {
  state: State;

  constructor(state: State) {
    this.state = state;
  }

  merge<T extends Record<string, unknown>>(base: T): T {
    let stateSubject = deepMergeLeft(base, mustExist(this.state.state)) as T;

    for (const child of this.state.children) {
      let childState = mustExist(child.state);
      if (child.children.size !== 0) {
        childState = new StateMerger(child).merge(stateSubject);
      }

      stateSubject = deepMergeLeft(stateSubject, childState) as T;
    }

    // Clean up merged state.
    (stateSubject as Record<string, string>).$schema =
      "https://schema.kitten-science.com/working-draft/settings-profile.schema.json";
    delete stateSubject.extends;

    return stateSubject;
  }
}
