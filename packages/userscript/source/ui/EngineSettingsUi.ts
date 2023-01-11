import { EngineSettings } from "../settings/EngineSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { ExpandoButton } from "./components/ExpandoButton";
import { SettingListItem } from "./components/SettingListItem";

export class EngineSettingsUi {
  readonly element: JQuery<HTMLElement>;
  readonly expando: ExpandoButton;
  private readonly _element: SettingListItem;
  private readonly _settings: EngineSettings;

  constructor(host: UserScript, settings: EngineSettings) {
    this._settings = settings;

    const label = ucfirst(host.engine.i18n("ui.engine"));

    // Our main element is a list item.
    this._element = new SettingListItem(host, label, settings, {
      onCheck: () => host.engine.start(true),
      onUnCheck: () => host.engine.stop(true),
    });
    this.element = this._element.element;

    this.expando = new ExpandoButton(host);
    this.element.append(this.expando.element);
  }

  setState(state: EngineSettings): void {
    this._settings.enabled = state.enabled;
  }

  refreshUi(): void {
    this.setState(this._settings);

    this._element.refreshUi();
  }
}
