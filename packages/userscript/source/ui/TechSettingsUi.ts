import { TechSettings } from "../settings/TechSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  protected readonly _techs: Array<SettingListItem>;

  constructor(host: UserScript, settings: TechSettings) {
    super(host, host.engine.i18n("ui.upgrade.techs"), settings);

    this.list.addEventListener("enableAll", () => {
      this._techs.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.list.addEventListener("disableAll", () => {
      this._techs.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.list.addEventListener("reset", () => {
      this.setting.load(new TechSettings());
      this.refreshUi();
    });

    const items = [];
    for (const setting of Object.values(this.setting.techs)) {
      const label = this._host.engine.i18n(`$science.${setting.tech}.label`);
      const button = new SettingListItem(this._host, label, setting, {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach(button => this.addChild(button.button));

    this._techs = items.map(button => button.button);
  }
}
