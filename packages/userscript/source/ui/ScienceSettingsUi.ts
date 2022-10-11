import { ScienceSettings } from "../options/ScienceSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { PolicySettingsUi } from "./PolicySettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { TechSettingsUi } from "./TechSettingsUi";

export class ScienceSettingsUi extends SettingsSectionUi<ScienceSettings> {
  private readonly _items: Array<SettingListItem>;
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;

  constructor(host: UserScript, settings: ScienceSettings) {
    super(host, host.engine.i18n("ui.upgrade"), settings);

    this._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ScienceSettings());
      this.refreshUi();
    });

    this._policiesUi = new PolicySettingsUi(this._host, this.settings.policies);
    this._techsUi = new TechSettingsUi(this._host, this.settings.techs);

    this._items = [this._policiesUi, this._techsUi];

    this.addChildren([this._techsUi, this._policiesUi]);
  }
}
