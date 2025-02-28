import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions, SettingTriggerMax } from "../../settings/Settings.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import type { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export declare class SettingMaxTriggerListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger,
> extends SettingListItem<SettingTriggerMax, TOptions> {
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;
  constructor(
    host: KittenScientists,
    setting: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=SettingMaxTriggerListItem.d.ts.map
