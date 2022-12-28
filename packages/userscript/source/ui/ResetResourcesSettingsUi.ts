import {
  ResetResourcesSettings,
  ResetResourcesSettingsItem,
} from "../settings/ResetResourcesSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { StockButton } from "./components/buttons-text/StockButton";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingListItem } from "./components/SettingListItem";

export class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  private readonly _resources: Array<SettingListItem>;

  constructor(host: UserScript, settings: ResetResourcesSettings) {
    const label = host.engine.i18n("ui.resources");
    super(
      host,
      label,
      settings,
      "M38.4 42 25.85 29.45l2.85-2.85 12.55 12.55ZM9.35 42 6.5 39.15 21 24.65l-5.35-5.35-1.15 1.15-2.2-2.2v4.25l-1.2 1.2L5 17.6l1.2-1.2h4.3L8.1 14l6.55-6.55q.85-.85 1.85-1.15 1-.3 2.2-.3 1.2 0 2.2.425 1 .425 1.85 1.275l-5.35 5.35 2.4 2.4-1.2 1.2 5.2 5.2 6.1-6.1q-.4-.65-.625-1.5-.225-.85-.225-1.8 0-2.65 1.925-4.575Q32.9 5.95 35.55 5.95q.75 0 1.275.15.525.15.875.4l-4.25 4.25 3.75 3.75 4.25-4.25q.25.4.425.975t.175 1.325q0 2.65-1.925 4.575Q38.2 19.05 35.55 19.05q-.9 0-1.55-.125t-1.2-.375Z"
    );

    this._list.addEventListener("enableAll", () => {
      this._resources.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._resources.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetResourcesSettings());
      this.refreshUi();
    });

    // Add all the current resources
    this._resources = [];
    for (const setting of Object.values(this.settings.resources)) {
      this._resources.push(
        this._addNewResourceOption(
          ucfirst(this._host.engine.i18n(`$resources.${setting.resource}.title`)),
          setting
        )
      );
    }
    this.addChildren(this._resources);
  }

  /**
   * Creates a UI element that reflects stock values for a given resource.
   * This is currently only used for the time/reset section.
   *
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock value.
   */
  private _addNewResourceOption(title: string, setting: ResetResourcesSettingsItem) {
    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [title]),
    });

    // How many items to stock.
    const stockElement = new StockButton(this._host, title, setting);
    container.addChild(stockElement);

    return container;
  }
}
