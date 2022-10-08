import { EngineSettings } from "../options/EngineSettings";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsSectionUiBase } from "./SettingsSectionUi";

export class EngineSettingsUi extends SettingsSectionUiBase {
  readonly element: JQuery<HTMLElement>;
  private readonly _settings: EngineSettings;

  constructor(host: UserScript, settings: EngineSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "engine";

    const itext = ucfirst(this._host.engine.i18n("ui.engine"));

    // Our main element is a list item.
    const element = new SettingListItem(host, toggleName, itext, settings, {
      onCheck: () => this._host.engine.start(true),
      onUnCheck: () => this._host.engine.stop(true),
    });
    this.element = element.element;
  }

  setState(state: EngineSettings): void {
    this._settings.enabled = state.enabled;
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();
  }
}
