import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions, SettingThreshold, SettingTrigger } from "../../settings/Settings.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export type SettingListItemOptionsTrigger = {
  readonly onRefreshTrigger: (subject: SettingTriggerListItem) => void;
  readonly onSetTrigger: (subject: SettingTriggerListItem) => void;
};
export declare class SettingTriggerListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsTrigger,
> extends SettingListItem {
  readonly triggerButton: TriggerButton;
  constructor(
    host: KittenScientists,
    setting: SettingThreshold | SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=SettingTriggerListItem.d.ts.map
