import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { Setting } from "./Settings.js";
export declare class StateSettings extends Setting {
  readonly noConfirm: Setting;
  readonly compress: Setting;
  constructor(noConfirm?: Setting, compress?: Setting);
  load(settings: Maybe<Partial<StateSettings>>): void;
}
//# sourceMappingURL=StateSettings.d.ts.map
