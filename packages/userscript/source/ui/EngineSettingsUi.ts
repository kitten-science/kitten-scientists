import { EngineSettings } from "../options/EngineSettings";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class EngineSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: EngineSettings;

  constructor(host: UserScript, settings: EngineSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "engine";

    const itext = ucfirst(this._host.i18n("ui.engine"));

    // Our main element is a list item.
    const element = $("<li/>", { id: `ks-${toggleName}` });

    const label = $("<label/>", {
      //for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: `toggle-${toggleName}`,
      type: "checkbox",
    });
    this._settings.$enabled = input;

    element.append(input, label);

    input.on("change", () => {
      if (input.is(":checked") && settings.enabled === false) {
        this._host.updateOptions(() => (settings.enabled = true));
        this._host.engine.start(true);
      } else if (!input.is(":checked") && settings.enabled === true) {
        this._host.updateOptions(() => (settings.enabled = false));
        this._host.engine.stop(true);
      }
    });

    const toggleOptionsVisiblity = this._getItemsToggle(toggleName);
    element.append(toggleOptionsVisiblity);

    this.element = element;
  }

  setState(state: EngineSettings): void {
    this._settings.enabled = state.enabled;
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
  }
}
