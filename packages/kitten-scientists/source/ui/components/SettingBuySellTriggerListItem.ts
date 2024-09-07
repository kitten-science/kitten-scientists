import { KittenScientists } from "../../KittenScientists.js";
import { SettingBuySellThreshold } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons-icon/TriggerButton.js";
import { BuyButton } from "./buttons-text/BuyButton.js";
import { SellButton } from "./buttons-text/SellButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export class SettingBuySellTriggerListItem extends SettingListItem {
  readonly buyButton: BuyButton;
  readonly sellButton: SellButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingBuySellThreshold,
    options?: Partial<SettingListItemOptions>,
  ) {
    super(host, label, setting, options);

    const triggerLabel = host.engine.i18n("blackcoin.buy.trigger");
    this.triggerButton = new TriggerButton(host, triggerLabel, setting);
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
