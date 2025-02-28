import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingMax } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
export type MaxButtonOptions = ButtonOptions & {
  readonly onRefresh: (subject: MaxButton) => void;
};
export declare class MaxButton extends Button {
  readonly setting: SettingMax;
  constructor(host: KittenScientists, setting: SettingMax, options?: Partial<MaxButtonOptions>);
}
//# sourceMappingURL=MaxButton.d.ts.map
