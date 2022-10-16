import { SettingMax } from "../options/Settings";
import { VillageSettings } from "../options/VillageSettings";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class VillageSettingsUi extends SettingsSectionUi<VillageSettings> {
  private readonly _jobs: Array<SettingListItem>;
  private readonly _hunt: SettingTriggerListItem;
  private readonly _festivals: SettingListItem;
  private readonly _promoteLeader: SettingListItem;

  constructor(host: UserScript, settings: VillageSettings) {
    const label = host.engine.i18n("ui.distribute");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._jobs.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._jobs.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new VillageSettings());
      this.refreshUi();
    });

    this._jobs = [
      this._getDistributeOption(
        this.setting.items.woodcutter,
        this._host.engine.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        this.setting.items.farmer,
        this._host.engine.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        this.setting.items.scholar,
        this._host.engine.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        this.setting.items.hunter,
        this._host.engine.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        this.setting.items.miner,
        this._host.engine.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        this.setting.items.priest,
        this._host.engine.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        this.setting.items.geologist,
        this._host.engine.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        this.setting.items.engineer,
        this._host.engine.i18n("$village.job.engineer"),
        true
      ),
    ];
    this.addChildren(this._jobs);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    this._hunt = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.hunt"),
      this.setting.hunt,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [this._host.engine.i18n("option.hunt")]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.hunt"),
          ]),
      }
    );
    this.addChild(this._hunt);

    this._festivals = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.festival"),
      this.setting.holdFestivals,
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
    this.addChild(this._festivals);

    this._promoteLeader = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.promote"),
      this.setting.promoteLeader,
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
    this.addChild(this._promoteLeader);
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
}
