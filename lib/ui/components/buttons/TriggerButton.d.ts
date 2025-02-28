import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import {
  type SettingOptions,
  type SettingThreshold,
  SettingTrigger,
} from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
export type TriggerButtonBehavior = "integer" | "percentage";
export type TriggerButtonOptions = ButtonOptions & {
  readonly onRefreshTitle: (subject: TriggerButton) => void;
};
export declare class TriggerButton extends Button {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;
  protected readonly _onRefreshTitle?: (subject: TriggerButton) => void;
  constructor(
    host: KittenScientists,
    setting: SettingTrigger | SettingThreshold,
    _locale: SettingOptions<SupportedLocale>,
    options?: Partial<TriggerButtonOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=TriggerButton.d.ts.map
