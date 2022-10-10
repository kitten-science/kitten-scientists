import { ScienceSettings } from "../options/ScienceSettings";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { PolicySettingsUi } from "./PolicySettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { TechSettingsUi } from "./TechSettingsUi";

export class ScienceSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: ScienceSettings;

  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;

  constructor(host: UserScript, settings: ScienceSettings) {
    const label = ucfirst(host.engine.i18n("ui.upgrade"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new ScienceSettings());
      this.refreshUi();
    });

    this._policiesUi = new PolicySettingsUi(this._host, this._settings.policies);
    this._techsUi = new TechSettingsUi(this._host, this._settings.techs);

    this._items = [this._policiesUi, this._techsUi];

    panel.list.append(this._techsUi.element, this._policiesUi.element);
  }

  setState(state: ScienceSettings): void {
    this._settings.enabled = state.enabled;

    this._policiesUi.setState(state.policies);
    this._techsUi.setState(state.techs);
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    this._policiesUi.refreshUi();
    this._techsUi.refreshUi();
  }
}
