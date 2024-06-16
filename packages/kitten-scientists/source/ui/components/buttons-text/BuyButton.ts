import { SettingBuy } from "../../../settings/Settings.js";
import { UserScript } from "../../../UserScript.js";
import { SettingsSectionUi } from "../../SettingsSectionUi.js";
import { TextButton } from "../TextButton.js";

interface BuyButtonHandlers {
  onClick?: () => void;
}

/**
 * A UI button that signifies a "buy" action.
 */
export class BuyButton extends TextButton {
  /**
   * The setting this button refers to.
   */
  readonly setting: SettingBuy;

  /**
   * Consturct a new BuyButton.
   * @param host - The userscript this button is hosted in.
   * @param label - The label of the button.
   * @param setting - The setting this button refers to.
   * @param handler - Custom handlers for events on the button.
   */
  constructor(
    host: UserScript,
    label: string,
    setting: SettingBuy,
    handler: BuyButtonHandlers = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = SettingsSectionUi.promptFloat(
          host.engine.i18n("blackcoin.buy.threshold"),
          setting.buy.toString(),
        );

        if (value !== null) {
          setting.buy = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.buy.toFixed(3),
    });

    this.element.addClass("ks-buy-button");

    this.setting = setting;
  }

  /**
   * Refresh the UI of this button.
   */
  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.buy.toFixed(3));
    this.element.text(
      this._host.engine.i18n("ui.buy", [SettingsSectionUi.renderFloat(this.setting.buy)]),
    );
  }
}
