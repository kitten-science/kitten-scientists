import { EngineSettings } from "../options/EngineSettings";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";

export class EngineSettingsUi {
  readonly element: JQuery<HTMLElement>;
  private readonly _settings: EngineSettings;

  constructor(host: UserScript, settings: EngineSettings) {
    this._settings = settings;

    const itext = ucfirst(host.engine.i18n("ui.engine"));

    // Our main element is a list item.
    const element = new SettingListItem(host, itext, settings, {
      onCheck: () => host.engine.start(true),
      onUnCheck: () => host.engine.stop(true),
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
