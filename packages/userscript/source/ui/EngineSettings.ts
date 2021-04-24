import { Options } from "../Options";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingsSection } from "./SettingsSection";

export class EngineSettings extends SettingsSection {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: Options["auto"]["engine"];

  constructor(
    host: UserScript,
    options: Options["auto"]["engine"] = host.options.auto.engine
  ) {
    super(host);

    this._options = options;

    const toggleName = "engine";

    const itext = ucfirst(this._host.i18n("ui.engine"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    element.append(input, label);

    input.on("change", () => {
      if (input.is(":checked") && options.enabled == false) {
        options.enabled = true;
        this._host.saveToKittenStorage();
      } else if (!input.is(":checked") && options.enabled == true) {
        options.enabled = false;
        this._host.saveToKittenStorage();
      }
    });

    this.element = element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
