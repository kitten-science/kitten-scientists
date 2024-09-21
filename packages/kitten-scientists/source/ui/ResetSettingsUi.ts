import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { ResetSettings } from "../settings/ResetSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi.js";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi.js";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi.js";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi.js";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi.js";
import { ResetUpgradesSettingsUi } from "./ResetUpgradesSettingsUi.js";

export class ResetSettingsUi extends SettingsPanel<ResetSettings> {
  private readonly _bonfireUi: ResetBonfireSettingsUi;
  private readonly _religionUi: ResetReligionSettingsUi;
  private readonly _resourcesUi: ResetResourcesSettingsUi;
  private readonly _spaceUi: ResetSpaceSettingsUi;
  private readonly _timeUi: ResetTimeSettingsUi;
  private readonly _upgradesUi: ResetUpgradesSettingsUi;

  constructor(
    host: KittenScientists,
    settings: ResetSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: SettingsPanelOptions<SettingsPanel<ResetSettings>>,
  ) {
    super(host, host.engine.i18n("option.time.reset"), settings, options);

    const list = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._bonfireUi = new ResetBonfireSettingsUi(this._host, this.setting.bonfire);
    this._religionUi = new ResetReligionSettingsUi(this._host, this.setting.religion);
    this._resourcesUi = new ResetResourcesSettingsUi(this._host, this.setting.resources);
    this._spaceUi = new ResetSpaceSettingsUi(this._host, this.setting.space);
    this._timeUi = new ResetTimeSettingsUi(this._host, this.setting.time);
    this._upgradesUi = new ResetUpgradesSettingsUi(this._host, this.setting.upgrades, language);

    list.addChildren([
      this._bonfireUi,
      this._religionUi,
      this._resourcesUi,
      this._spaceUi,
      this._timeUi,
      this._upgradesUi,
    ]);
    this.addChild(list);
  }
}
