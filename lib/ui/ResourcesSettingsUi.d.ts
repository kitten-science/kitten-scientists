import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResourcesSettings } from "../settings/ResourcesSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class ResourcesSettingsUi extends SettingsPanel<ResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResourcesSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  );
  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param label The title to apply to the option.
   * @param option The option that is being controlled.
   * @returns A new option with stock and consume values.
   */
  private _makeResourceSetting;
}
//# sourceMappingURL=ResourcesSettingsUi.d.ts.map
