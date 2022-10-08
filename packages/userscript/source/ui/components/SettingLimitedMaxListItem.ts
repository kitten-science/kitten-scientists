import { SettingLimitedMax } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { MaxButton } from "./MaxButton";
import { SettingLimitedListItem } from "./SettingLimitedListItem";

export class SettingLimitedMaxListItem extends SettingLimitedListItem {
  readonly maxButton: MaxButton;

  constructor(
    host: UserScript,
    id: string,
    label: string,
    setting: SettingLimitedMax,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
      onLimitedCheck: () => void;
      onLimitedUnCheck: () => void;
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
