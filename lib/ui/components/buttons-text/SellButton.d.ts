import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingOptions, SettingSell } from "../../../settings/Settings.js";
import { TextButton } from "../TextButton.js";
export declare class SellButton extends TextButton {
  readonly setting: SettingSell;
  constructor(
    host: KittenScientists,
    setting: SettingSell,
    locale: SettingOptions<SupportedLocale>,
    handler?: {
      onClick?: () => void;
    },
  );
  refreshUi(): void;
}
//# sourceMappingURL=SellButton.d.ts.map
