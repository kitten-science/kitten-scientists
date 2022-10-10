import { SettingMax } from "../options/Settings";
import { VillageSettings } from "../options/VillageSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class VillageSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: VillageSettings;

  constructor(host: UserScript, settings: VillageSettings) {
    const label = ucfirst(host.engine.i18n("ui.distribute"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new VillageSettings());
      this.refreshUi();
    });

    this._items = [
      this._getDistributeOption(
        this._settings.items.woodcutter,
        this._host.engine.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        this._settings.items.farmer,
        this._host.engine.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        this._settings.items.scholar,
        this._host.engine.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        this._settings.items.hunter,
        this._host.engine.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        this._settings.items.miner,
        this._host.engine.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        this._settings.items.priest,
        this._host.engine.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        this._settings.items.geologist,
        this._host.engine.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        this._settings.items.engineer,
        this._host.engine.i18n("$village.job.engineer"),
        true
      ),
    ];

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }

    const additionOptions = this._getAdditionOptions();
    panel.list.append(additionOptions);
  }

  private _getDistributeOption(option: SettingMax, label: string, delimiter = false) {
    return new SettingMaxListItem(
      this._host,
      label,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      },
      delimiter
    );
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const nodeHeader = new HeaderListItem(this._host, "Additional options");

    const nodeHunt = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.hunt"),
      this._settings.hunt,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [this._host.engine.i18n("option.hunt")]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.hunt"),
          ]),
      }
    );

    const nodeFestivals = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.festival"),
      this._settings.holdFestivals,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.festival"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.festival"),
          ]),
      }
    );

    const nodePromote = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.promote"),
      this._settings.promoteLeader,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.promote"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.promote"),
          ]),
      }
    );

    return [nodeHeader.element, nodeHunt.element, nodeFestivals.element, nodePromote.element];
  }

  setState(state: VillageSettings): void {
    this._settings.enabled = state.enabled;

    this._settings.holdFestivals.enabled = state.holdFestivals.enabled;
    this._settings.hunt.enabled = state.hunt.enabled;
    this._settings.promoteLeader.enabled = state.promoteLeader.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    mustExist(this._settings.holdFestivals.$enabled).refreshUi();
    mustExist(this._settings.hunt.$enabled).refreshUi();
    mustExist(this._settings.hunt.$trigger).refreshUi();
    mustExist(this._settings.promoteLeader.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }
  }
}
