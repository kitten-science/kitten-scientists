import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
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
export class VillageSettingsUi extends SettingsPanel {
  _hunt;
  _festivals;
  _promoteKittens;
  _promoteLeader;
  _electLeader;
  constructor(host, settings, locale) {
    const label = host.engine.i18n("ui.distribute");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
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
        .map(job =>
          this._getDistributeOption(
            host,
            this.setting.jobs[job.name],
            locale.selected,
            settings,
            job.title,
          ),
        ),
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
          this._hunt.triggerButton.ineffective =
            this.setting.enabled && this.setting.hunt.enabled && this.setting.hunt.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.hunt.prompt", [
              host.renderPercentage(this.setting.hunt.trigger, locale.selected, true),
            ]),
            host.renderPercentage(this.setting.hunt.trigger),
            host.engine.i18n("ui.trigger.hunt.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }
              this.setting.hunt.trigger = host.parsePercentage(value);
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
      this.setting.holdFestivals,
      host.engine.i18n("option.festival"),
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
          this._promoteKittens.triggerButton.inactive = !this.setting.promoteKittens.enabled;
          this._promoteKittens.triggerButton.ineffective =
            this.setting.enabled &&
            this.setting.promoteKittens.enabled &&
            this.setting.promoteKittens.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.promoteKittens.promptTitle"),
            host.engine.i18n("ui.trigger.promoteKittens.prompt", [
              host.renderPercentage(this.setting.promoteKittens.trigger, locale.selected, true),
            ]),
            host.renderPercentage(this.setting.promoteKittens.trigger),
            host.engine.i18n("ui.trigger.promoteKittens.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }
              this.setting.promoteKittens.trigger = host.parsePercentage(value);
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
      this.setting.promoteLeader,
      host.engine.i18n("option.promote"),
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
    for (const option of this.setting.electLeader.job.options) {
      if (option.value === "any") {
        option.label = host.engine.i18n("option.elect.job.any");
      } else {
        option.label = host.engine.i18n(`$village.job.${option.value}`);
      }
    }
    for (const option of this.setting.electLeader.trait.options) {
      option.label = host.engine.i18n(`$village.trait.${option.value}`);
    }
    this._electLeader = new SettingListItem(
      host,
      this.setting.electLeader,
      host.engine.i18n("option.elect"),
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
  _getDistributeOption(host, option, locale, sectionSetting, label, delimiter = false) {
    const onSetMax = () => {
      Dialog.prompt(
        host,
        host.engine.i18n("ui.max.distribute.prompt", [label]),
        host.engine.i18n("ui.max.distribute.promptTitle", [
          label,
          host.renderAbsolute(option.max, locale),
        ]),
        host.renderAbsolute(option.max),
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
          option.max = host.parseAbsolute(value) ?? option.max;
        })
        .then(() => {
          this.refreshUi();
        })
        .catch(redirectErrorsToConsole(console));
    };
    const element = new SettingMaxListItem(host, option, label, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0) {
          onSetMax();
        }
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.distribute.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.distribute.titleZero", [label])
              : host.engine.i18n("ui.max.distribute.title", [
                  host.renderAbsolute(option.max),
                  label,
                ]);
      },
      onSetMax,
    });
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
//# sourceMappingURL=VillageSettingsUi.js.map
