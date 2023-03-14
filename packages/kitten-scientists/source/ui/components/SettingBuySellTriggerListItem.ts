import { SettingBuySellTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { TriggerButton, TriggerButtonBehavior } from "./buttons-icon/TriggerButton";
import { BuyButton } from "./buttons-text/BuyButton";
import { SellButton } from "./buttons-text/SellButton";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem";

export type SettingBuySellTriggerListItemOptions = SettingListItemOptions & {
  behavior: TriggerButtonBehavior;
};

export class SettingBuySellTriggerListItem extends SettingListItem {
  readonly buyButton: BuyButton;
  readonly sellButton: SellButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingBuySellTrigger,
    options?: Partial<SettingBuySellTriggerListItemOptions>
  ) {
    super(host, label, setting, options);

    const triggerLabel = host.engine.i18n("blackcoin.buy.trigger");
    this.triggerButton = new TriggerButton(host, triggerLabel, setting, options?.behavior);
    this.element.append(this.triggerButton.element);

    this.sellButton = new SellButton(host, label, setting);
    this.element.append(this.sellButton.element);

    this.buyButton = new BuyButton(host, label, setting);
    this.element.append(this.buyButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.buyButton.refreshUi();
    this.sellButton.refreshUi();
    this.triggerButton.refreshUi();
  }
}
