import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingMax, SettingOptions } from "../settings/Settings.js";
import { VillageSettings } from "../settings/VillageSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class VillageSettingsUi extends SettingsPanel<VillageSettings> {
  private readonly _hunt: SettingTriggerListItem;
  private readonly _festivals: SettingListItem;
  private readonly _promoteKittens: SettingTriggerListItem;
  private readonly _promoteLeader: SettingListItem;
  private readonly _electLeader: SettingListItem;

  constructor(
    host: KittenScientists,
    settings: VillageSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.distribute");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
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
      this.setting.hunt,
      locale,
      host.engine.i18n("option.hunt"),
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.hunt")]);
        },
        onRefresh: () => {
          this._hunt.triggerButton.inactive = !this.setting.hunt.enabled;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.hunt.prompt", [
              UiComponent.renderPercentage(this.setting.hunt.trigger, locale.selected, true),
            ]),
            UiComponent.renderPercentage(this.setting.hunt.trigger, locale.selected),
            host.engine.i18n("ui.trigger.hunt.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              this.setting.hunt.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              this._hunt.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      },
    );
    this._hunt.triggerButton.element.addClass(stylesButton.lastHeadAction);
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
      this.setting.promoteKittens,
      locale,
      host.engine.i18n("option.promotekittens"),
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.promotekittens")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.promotekittens")]);
        },
        onRefresh: () => {
          this._promoteKittens.triggerButton.inactive =
            !this.setting.promoteKittens.enabled || this.setting.promoteKittens.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.promoteKittens.promptTitle"),
            host.engine.i18n("ui.trigger.promoteKittens.prompt", [
              UiComponent.renderPercentage(
                this.setting.promoteKittens.trigger,
                locale.selected,
                true,
              ),
            ]),
            UiComponent.renderPercentage(this.setting.promoteKittens.trigger, locale.selected),
            host.engine.i18n("ui.trigger.promoteKittens.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              this.setting.promoteKittens.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      },
    );
    this._promoteKittens.triggerButton.element.addClass(stylesButton.lastHeadAction);
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
    const item = new SettingMaxListItem(host, label, option, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        item.maxButton.inactive = !option.enabled || option.max === 0 || option.max === -1;
      },
      onRefreshMax: () => {
        item.maxButton.updateLabel(UiComponent.renderAbsolute(option.max, host));
        item.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.distribute.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.distribute.titleZero", [label])
              : host.engine.i18n("ui.max.distribute.title", [
                  UiComponent.renderAbsolute(option.max, host),
                  label,
                ]);
      },
      onSetMax: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("ui.max.distribute.prompt", [label]),
          host.engine.i18n("ui.max.distribute.promptTitle", [
            label,
            UiComponent.renderAbsolute(option.max, host),
          ]),
          UiComponent.renderAbsolute(option.max, host),
          host.engine.i18n("ui.max.distribute.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              option.max = -1;
              return;
            }

            if (value === "0") {
              option.enabled = false;
            }

            option.max = UiComponent.parseAbsolute(value) ?? option.max;
          })
          .then(() => {
            this.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
    });
    item.maxButton.element.addClass(stylesButton.lastHeadAction);
    return item;
  }
}
