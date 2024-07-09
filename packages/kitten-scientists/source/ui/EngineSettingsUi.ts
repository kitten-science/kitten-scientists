import { KittenScientists } from "../KittenScientists.js";
import { EngineSettings } from "../settings/EngineSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ExpandoButton } from "./components/ExpandoButton.js";
import { SettingListItem } from "./components/SettingListItem.js";

export class EngineSettingsUi {
  readonly element: JQuery;
  readonly expando: ExpandoButton;
  private readonly _element: SettingListItem;
  private readonly _settings: EngineSettings;

  constructor(host: KittenScientists, settings: EngineSettings) {
    this._settings = settings;

    const label = ucfirst(host.engine.i18n("ui.engine"));

    // Our main element is a list item.
    this._element = new SettingListItem(host, label, settings, {
      onCheck: () => {
        host.engine.start(true);
      },
      onUnCheck: () => {
        host.engine.stop(true);
      },
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
