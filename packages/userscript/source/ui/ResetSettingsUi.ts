import { ResetSettings } from "../options/ResetSettings";
import { UserScript } from "../UserScript";
import { SettingsPanel } from "./components/SettingsPanel";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi";

export class ResetSettingsUi extends SettingsPanel<ResetSettings> {
  private readonly _bonfireUi: ResetBonfireSettingsUi;
  private readonly _religionUi: ResetReligionSettingsUi;
  private readonly _resourcesUi: ResetResourcesSettingsUi;
  private readonly _spaceUi: ResetSpaceSettingsUi;
  private readonly _timeUi: ResetTimeSettingsUi;

  constructor(host: UserScript, settings: ResetSettings) {
    super(host, host.engine.i18n("option.time.reset"), settings);

    this._list.addEventListener("enableAll", () => {
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetSettings());
      this.refreshUi();
    });

    this._bonfireUi = new ResetBonfireSettingsUi(this._host, this.settings.bonfire);
    this._religionUi = new ResetReligionSettingsUi(this._host, this.settings.religion);
    this._resourcesUi = new ResetResourcesSettingsUi(this._host, this.settings.resources);
    this._spaceUi = new ResetSpaceSettingsUi(this._host, this.settings.space);
    this._timeUi = new ResetTimeSettingsUi(this._host, this.settings.time);

    this.addChildren([
      this._bonfireUi,
      this._religionUi,
      this._resourcesUi,
      this._spaceUi,
      this._timeUi,
    ]);
  }
}
