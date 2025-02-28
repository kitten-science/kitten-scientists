import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingBuy, SettingOptions } from "../../../settings/Settings.js";
import { TextButton } from "../TextButton.js";
export declare class BuyButton extends TextButton {
  readonly setting: SettingBuy;
  constructor(
    host: KittenScientists,
    setting: SettingBuy,
    locale: SettingOptions<SupportedLocale>,
    handler?: {
      onClick?: () => void;
    },
  );
  refreshUi(): void;
}
//# sourceMappingURL=BuyButton.d.ts.map
