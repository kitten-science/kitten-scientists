import { SettingMax } from "../settings/Settings";
import { VillageSettings } from "../settings/VillageSettings";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { OptionsListItem } from "./components/OptionsListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class VillageSettingsUi extends SettingsSectionUi<VillageSettings> {
  private readonly _jobs: Array<SettingListItem>;
  private readonly _hunt: SettingTriggerListItem;
  private readonly _festivals: SettingListItem;
  private readonly _unprofitableFestivals: SettingListItem;
  private readonly _promoteKittens: SettingTriggerListItem;
  private readonly _promoteLeader: SettingListItem;
  private readonly _electLeader: SettingListItem;

  constructor(host: UserScript, settings: VillageSettings) {
    const label = host.engine.i18n("ui.distribute");
    super(host, label, settings);

    const listJobs = new SettingsList(this._host);
    this._jobs = [
      this._getDistributeOption(
        this.setting.jobs.woodcutter,
        this._host.engine.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        this.setting.jobs.farmer,
        this._host.engine.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        this.setting.jobs.scholar,
        this._host.engine.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        this.setting.jobs.hunter,
        this._host.engine.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        this.setting.jobs.miner,
        this._host.engine.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        this.setting.jobs.priest,
        this._host.engine.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        this.setting.jobs.geologist,
        this._host.engine.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        this.setting.jobs.engineer,
        this._host.engine.i18n("$village.job.engineer")
      ),
    ];
    listJobs.addChildren(this._jobs);
    this.addChild(listJobs);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listAddition.addChild(new HeaderListItem(this._host, "Additional options"));

    this._hunt = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.hunt"),
      this.setting.hunt,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [this._host.engine.i18n("option.hunt")]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [this._host.engine.i18n("option.hunt")]),
      }
    );
    listAddition.addChild(this._hunt);

    this._festivals = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.festival"),
      this.setting.holdFestivals,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.festival"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.festival"),
          ]),
      }
    );
    listAddition.addChild(this._festivals);

    this._unprofitableFestivals = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.festival.unprofitable"),
      this.setting.holdUnprofitableFestivals,
      {
        delimiter: false,
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.festival.unprofitable"),
          ]);
          this._festivals.setting.enabled = true;
          this.refreshUi();
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.festival.unprofitable"),
          ]);
          this.refreshUi();
        },
        upgradeIndicator: true,
      }
    );
    listAddition.addChild(this._unprofitableFestivals);

    this._promoteKittens = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.promotekittens"),
      this.setting.promoteKittens,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.promotekittens"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.promotekittens"),
          ]),
      }
    );
    listAddition.addChild(this._promoteKittens);

    this._promoteLeader = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.promote"),
      this.setting.promoteLeader,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.promote"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.promote"),
          ]),
      }
    );
    listAddition.addChild(this._promoteLeader);

    this._electLeader = new SettingListItem(this._host, "Elect leader", this.setting.electLeader, {
      onCheck: () =>
        this._host.engine.imessage("status.sub.enable", [this._host.engine.i18n("option.elect")]),
      onUnCheck: () =>
        this._host.engine.imessage("status.sub.disable", [this._host.engine.i18n("option.elect")]),
    });
    listAddition.addChild(this._electLeader);

    this._electLeader.addChildren([
      new OptionsListItem(host, "Job", this.setting.electLeader.job),
      new OptionsListItem(host, "Trait", this.setting.electLeader.trait),
    ]);
    this.addChild(listAddition);
  }

  private _getDistributeOption(option: SettingMax, label: string, delimiter = false) {
    return new SettingMaxListItem(this._host, label, option, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }

  refreshUi(): void {
    this._festivals.readOnly = this._unprofitableFestivals.setting.enabled;
    super.refreshUi();
  }
}
