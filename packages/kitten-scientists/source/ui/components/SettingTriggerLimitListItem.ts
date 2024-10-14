import { KittenScientists } from "../../KittenScientists.js";
import { SettingTrigger } from "../../settings/Settings.js";
import { TriggerLimitButton } from "./buttons-text/TriggerLimitButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export class SettingTriggerLimitListItem extends SettingListItem {
  readonly triggerButton: TriggerLimitButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger,
    options?: Partial<SettingListItemOptions>,
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerLimitButton(host, label, setting);
    this.head.addChild(this.triggerButton);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
