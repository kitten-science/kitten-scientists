import { PolicySettings } from "../options/PolicySettings";
import { objectEntries } from "../tools/Entries";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class PolicySettingsUi extends SettingsPanel {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: PolicySettings;

  constructor(host: UserScript, settings: PolicySettings) {
    super(host, host.engine.i18n("ui.upgrade.policies"), settings);

    this._settings = settings;

    this._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this._settings.load(new PolicySettings());
      this.refreshUi();
    });

    const items = [];
    for (const [name, setting] of objectEntries(this._settings.items)) {
      const policyLabel = this.host.engine.i18n(
        `$policy.${name === "authocracy" ? "autocracy" : name}.label`
      );
      const policyButton = new SettingListItem(this.host, policyLabel, setting, {
        onCheck: () => this.host.engine.imessage("status.auto.enable", [policyLabel]),
        onUnCheck: () => this.host.engine.imessage("status.auto.disable", [policyLabel]),
      });

      items.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach(button => this.list.append(button.button.element));

    this._items = items.map(button => button.button);
  }

  setState(state: PolicySettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
    }
  }
}
