import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions } from "../../settings/Settings.js";
import type { CraftSettingsItem } from "../../settings/WorkshopSettings.js";
import type { SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import type { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export declare class WorkshopCraftListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger,
> extends SettingListItem<CraftSettingsItem> {
  readonly limitedButton: LimitedButton;
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;
  constructor(
    host: KittenScientists,
    setting: CraftSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=WorkshopCraftListItem.d.ts.map
