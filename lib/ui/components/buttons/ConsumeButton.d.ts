import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { ResourcesSettingsItem } from "../../../settings/ResourcesSettings.js";
import type { SettingOptions } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
export declare class ConsumeButton extends Button {
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;
  constructor(
    host: KittenScientists,
    setting: ResourcesSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    resourceName: string,
    options?: Partial<ButtonOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=ConsumeButton.d.ts.map
