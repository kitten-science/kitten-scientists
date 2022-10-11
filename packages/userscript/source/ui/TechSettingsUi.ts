import { TechSettings } from "../options/TechSettings";
import { objectEntries } from "../tools/Entries";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  protected readonly _techs: Array<SettingListItem>;

  constructor(host: UserScript, settings: TechSettings) {
    super(host, host.engine.i18n("ui.upgrade.techs"), settings);

    this._list.addEventListener("enableAll", () => {
      this._techs.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._techs.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new TechSettings());
      this.refreshUi();
    });

    const items = [];
    for (const [name, setting] of objectEntries(this.settings.items)) {
      const label = this._host.engine.i18n(`$science.${name}.label`);
      const button = new SettingListItem(this._host, label, setting, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach(button => this.addChild(button.button));

    this._techs = items.map(button => button.button);
  }
}
