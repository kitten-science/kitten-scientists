import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingLimited } from "../../../settings/Settings.js";
import { Button } from "../Button.js";
import type { UiComponentOptions } from "../UiComponent.js";
export type LimitedButtonOptions = UiComponentOptions & {
  readonly onLimitedCheck: () => void;
  readonly onLimitedUnCheck: () => void;
};
export declare class LimitedButton extends Button {
  readonly setting: SettingLimited;
  constructor(
    host: KittenScientists,
    setting: SettingLimited,
    options?: Partial<LimitedButtonOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=LimitedButton.d.ts.map
