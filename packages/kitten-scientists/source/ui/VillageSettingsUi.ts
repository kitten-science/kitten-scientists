import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingMax } from "../settings/Settings.js";
import { VillageSettings } from "../settings/VillageSettings.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class VillageSettingsUi extends AbstractBuildSettingsPanel<VillageSettings> {
  private readonly _hunt: SettingTriggerListItem;
  private readonly _festivals: SettingListItem;
  private readonly _promoteKittens: SettingTriggerListItem;
  private readonly _promoteLeader: SettingListItem;
  private readonly _electLeader: SettingListItem;

  constructor(host: KittenScientists, settings: VillageSettings) {
    const label = host.engine.i18n("ui.distribute");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    const listJobs = new SettingsList(this._host, {
      children: this._host.game.village.jobs
        .filter(item => !isNil(this.setting.jobs[item.name]))
        .map(job => this._getDistributeOption(this.setting.jobs[job.name], job.title)),
    });
    this.addChild(listJobs);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listAddition.addChild(new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")));

    this._hunt = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.hunt"),
      this.setting.hunt,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [this._host.engine.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [this._host.engine.i18n("option.hunt")]);
        },
      },
    );
    listAddition.addChild(this._hunt);

    this._festivals = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.festival"),
      this.setting.holdFestivals,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.festival"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.festival"),
          ]);
        },
      },
    );
    listAddition.addChild(this._festivals);

    this._promoteKittens = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.promotekittens"),
      this.setting.promoteKittens,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.promotekittens"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.promotekittens"),
          ]);
        },
      },
    );
    listAddition.addChild(this._promoteKittens);

    this._promoteLeader = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.promote"),
      this.setting.promoteLeader,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.promote"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.promote"),
          ]);
        },
      },
    );
    listAddition.addChild(this._promoteLeader);

    this.setting.electLeader.job.options.forEach(option => {
      if (option.value === "any") {
        option.label = this._host.engine.i18n("option.elect.job.any");
      } else {
        option.label = this._host.engine.i18n(`$village.job.${option.value}`);
      }
    });

    this.setting.electLeader.trait.options.forEach(option => {
      option.label = this._host.engine.i18n(`$village.trait.${option.value}`);
    });

    this._electLeader = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.elect"),
      this.setting.electLeader,
      {
        children: [
          new OptionsListItem(
            host,
            this._host.engine.i18n("option.elect.job"),
            this.setting.electLeader.job,
          ),
          new OptionsListItem(
            host,
            this._host.engine.i18n("option.elect.trait"),
            this.setting.electLeader.trait,
          ),
        ],
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [this._host.engine.i18n("option.elect")]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.elect"),
          ]);
        },
      },
    );
    listAddition.addChild(this._electLeader);

    this.addChild(listAddition);
  }

  private _getDistributeOption(option: SettingMax, label: string, delimiter = false) {
    return new SettingMaxListItem(this._host, label, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
    });
  }
}
