import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingMax } from "../settings/Settings.js";
import { VillageSettings } from "../settings/VillageSettings.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class VillageSettingsUi extends SettingsPanel<VillageSettings> {
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

    const listJobs = new SettingsList(host, {
      children: host.game.village.jobs
        .filter(item => !isNil(this.setting.jobs[item.name]))
        .map(job => this._getDistributeOption(host, this.setting.jobs[job.name], job.title)),
    });
    this.addChild(listJobs);

    const listAddition = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listAddition.addChild(new HeaderListItem(host, host.engine.i18n("ui.additional")));

    this._hunt = new SettingTriggerListItem(
      host,
      host.engine.i18n("option.hunt"),
      this.setting.hunt,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.hunt")]);
        },
      },
    );
    listAddition.addChild(this._hunt);

    this._festivals = new SettingListItem(
      host,
      host.engine.i18n("option.festival"),
      this.setting.holdFestivals,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.festival")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.festival")]);
        },
      },
    );
    listAddition.addChild(this._festivals);

    this._promoteKittens = new SettingTriggerListItem(
      host,
      host.engine.i18n("option.promotekittens"),
      this.setting.promoteKittens,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.promotekittens")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.promotekittens")]);
        },
      },
    );
    listAddition.addChild(this._promoteKittens);

    this._promoteLeader = new SettingListItem(
      host,
      host.engine.i18n("option.promote"),
      this.setting.promoteLeader,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.promote")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.promote")]);
        },
      },
    );
    listAddition.addChild(this._promoteLeader);

    this.setting.electLeader.job.options.forEach(option => {
      if (option.value === "any") {
        option.label = host.engine.i18n("option.elect.job.any");
      } else {
        option.label = host.engine.i18n(`$village.job.${option.value}`);
      }
    });

    this.setting.electLeader.trait.options.forEach(option => {
      option.label = host.engine.i18n(`$village.trait.${option.value}`);
    });

    this._electLeader = new SettingListItem(
      host,
      host.engine.i18n("option.elect"),
      this.setting.electLeader,
      {
        children: [
          new OptionsListItem(
            host,
            host.engine.i18n("option.elect.job"),
            this.setting.electLeader.job,
          ),
          new OptionsListItem(
            host,
            host.engine.i18n("option.elect.trait"),
            this.setting.electLeader.trait,
          ),
        ],
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.elect")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.elect")]);
        },
      },
    );
    listAddition.addChild(this._electLeader);

    this.addChild(listAddition);
  }

  private _getDistributeOption(
    host: KittenScientists,
    option: SettingMax,
    label: string,
    delimiter = false,
  ) {
    return new SettingMaxListItem(host, label, option, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
    });
  }
}
