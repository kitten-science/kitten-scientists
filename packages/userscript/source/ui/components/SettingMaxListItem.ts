import { SettingMax } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { MaxButton } from "./MaxButton";
import { SettingListItem } from "./SettingListItem";

export class SettingMaxListItem extends SettingListItem {
  readonly maxButton: MaxButton;

  constructor(
    host: UserScript,
    id: string,
    label: string,
    setting: SettingMax,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false,
    additionalClasses = []
  ) {
    super(host, id, label, setting, handler, delimiter, upgradeIndicator, additionalClasses);

    this.maxButton = new MaxButton(host, id, label, setting);
    this.element.append(this.maxButton.element);
  }

  refreshUi() {
    super.refreshUi();
    this.maxButton.refreshUi();
  }
}
