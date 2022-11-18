import { ScienceSettings } from "../settings/ScienceSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { PolicySettingsUi } from "./PolicySettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { TechSettingsUi } from "./TechSettingsUi";

export class ScienceSettingsUi extends SettingsSectionUi<ScienceSettings> {
  private readonly _items: Array<SettingListItem>;
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  protected readonly _observeStars: SettingListItem;

  constructor(host: UserScript, settings: ScienceSettings) {
    super(host, host.engine.i18n("ui.upgrade"), settings);

    this._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new ScienceSettings());
      this.refreshUi();
    });

    this._policiesUi = new PolicySettingsUi(this._host, this.setting.policies);
    this._techsUi = new TechSettingsUi(this._host, this.setting.techs);

    this._observeStars = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.observe"),
      this.setting.observe,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.observe"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.observe"),
          ]),
      }
    );
    this.addChild(this._observeStars);

    this._items = [this._policiesUi, this._techsUi, this._observeStars];

    this.addChildren([this._techsUi, this._policiesUi, this._observeStars]);
  }
}
