import { SettingLimited } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { LimitedButton } from "./LimitedButton";
import { SettingListItem } from "./SettingListItem";

export class SettingLimitedListItem extends SettingListItem {
  readonly limitedButton: LimitedButton;

  constructor(
    host: UserScript,
    id: string,
    label: string,
    setting: SettingLimited,
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

    this.limitedButton = new LimitedButton(host, id, setting, handler);
    this.element.append(this.limitedButton.element);
  }

  refreshUi() {
    super.refreshUi();
    this.limitedButton.refreshUi();
  }
}
