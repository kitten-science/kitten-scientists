import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingMax, SettingOptions } from "../settings/Settings.js";
import type { VillageSettings } from "../settings/VillageSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class VillageSettingsUi extends SettingsPanel<VillageSettings> {
  private readonly _hunt: SettingTriggerListItem;
  private readonly _festivals: SettingListItem;
  private readonly _promoteKittens: SettingTriggerListItem;
  private readonly _promoteLeader: SettingListItem;
  private readonly _electLeader: SettingListItem;

  constructor(
    parent: UiComponent,
    settings: VillageSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.distribute");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
      }),
    );

    const listJobs = new SettingsList(parent, {
      children: parent.host.game.village.jobs
        .filter(item => !isNil(this.setting.jobs[item.name]))
        .map(job =>
          this._getDistributeOption(
            parent,
            this.setting.jobs[job.name],
            locale.selected,
            settings,
            job.title,
          ),
        ),
    });
    this.addChild(listJobs);

    const listAddition = new SettingsList(parent, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listAddition.addChild(new HeaderListItem(parent, parent.host.engine.i18n("ui.additional")));

    this._hunt = new SettingTriggerListItem(
      parent,
      this.setting.hunt,
      locale,
      parent.host.engine.i18n("option.hunt"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.hunt"),
          ]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.hunt"),
          ]);
        },
        onRefresh: () => {
          this._hunt.triggerButton.inactive = !this.setting.hunt.enabled;
          this._hunt.triggerButton.ineffective =
            this.setting.enabled && this.setting.hunt.enabled && this.setting.hunt.trigger === -1;
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.hunt.prompt", [
              parent.host.renderPercentage(this.setting.hunt.trigger, locale.selected, true),
            ]),
            parent.host.renderPercentage(this.setting.hunt.trigger),
            parent.host.engine.i18n("ui.trigger.hunt.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.hunt.trigger = parent.host.parsePercentage(value);
        },
      },
    );
    this._hunt.triggerButton.element.addClass(stylesButton.lastHeadAction);
    listAddition.addChild(this._hunt);

    this._festivals = new SettingListItem(
      parent,
      this.setting.holdFestivals,
      parent.host.engine.i18n("option.festival"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.festival"),
          ]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.festival"),
          ]);
        },
      },
    );
    listAddition.addChild(this._festivals);

    this._promoteKittens = new SettingTriggerListItem(
      parent,
      this.setting.promoteKittens,
      locale,
      parent.host.engine.i18n("option.promotekittens"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.promotekittens"),
          ]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.promotekittens"),
          ]);
        },
        onRefresh: () => {
          this._promoteKittens.triggerButton.inactive = !this.setting.promoteKittens.enabled;
          this._promoteKittens.triggerButton.ineffective =
            this.setting.enabled &&
            this.setting.promoteKittens.enabled &&
            this.setting.promoteKittens.trigger === -1;
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.promoteKittens.promptTitle"),
            parent.host.engine.i18n("ui.trigger.promoteKittens.prompt", [
              parent.host.renderPercentage(
                this.setting.promoteKittens.trigger,
                locale.selected,
                true,
              ),
            ]),
            parent.host.renderPercentage(this.setting.promoteKittens.trigger),
            parent.host.engine.i18n("ui.trigger.promoteKittens.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.promoteKittens.trigger = parent.host.parsePercentage(value);
        },
      },
    );
    this._promoteKittens.triggerButton.element.addClass(stylesButton.lastHeadAction);
    listAddition.addChild(this._promoteKittens);

    this._promoteLeader = new SettingListItem(
      parent,
      this.setting.promoteLeader,
      parent.host.engine.i18n("option.promote"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.promote"),
          ]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.promote"),
          ]);
        },
      },
    );
    listAddition.addChild(this._promoteLeader);

    for (const option of this.setting.electLeader.job.options) {
      if (option.value === "any") {
        option.label = parent.host.engine.i18n("option.elect.job.any");
      } else {
        option.label = parent.host.engine.i18n(`$village.job.${option.value}`);
      }
    }

    for (const option of this.setting.electLeader.trait.options) {
      option.label = parent.host.engine.i18n(`$village.trait.${option.value}`);
    }

    this._electLeader = new SettingListItem(
      parent,
      this.setting.electLeader,
      parent.host.engine.i18n("option.elect"),
      {
        children: [
          new OptionsListItem(
            parent,
            parent.host.engine.i18n("option.elect.job"),
            this.setting.electLeader.job,
          ),
          new OptionsListItem(
            parent,
            parent.host.engine.i18n("option.elect.trait"),
            this.setting.electLeader.trait,
          ),
        ],
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.elect"),
          ]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.elect"),
          ]);
        },
      },
    );
    listAddition.addChild(this._electLeader);

    this.addChild(listAddition);
  }

  private _getDistributeOption(
    parent: UiComponent,
    option: SettingMax,
    locale: SupportedLocale,
    sectionSetting: VillageSettings,
    label: string,
    delimiter = false,
  ) {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        parent,
        parent.host.engine.i18n("ui.max.distribute.prompt", [label]),
        parent.host.engine.i18n("ui.max.distribute.promptTitle", [
          label,
          parent.host.renderAbsolute(option.max, locale),
        ]),
        parent.host.renderAbsolute(option.max),
        parent.host.engine.i18n("ui.max.distribute.promptExplainer"),
      );

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

      option.max = parent.host.parseAbsolute(value) ?? option.max;
    };

    const element = new SettingMaxListItem(parent, option, label, {
      childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
      delimiter,
      onCheck: (isBatchProcess?: boolean) => {
        parent.host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          onSetMax();
        }
      },
      onUnCheck: () => {
        parent.host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(parent.host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? parent.host.engine.i18n("ui.max.distribute.titleInfinite", [label])
            : option.max === 0
              ? parent.host.engine.i18n("ui.max.distribute.titleZero", [label])
              : parent.host.engine.i18n("ui.max.distribute.title", [
                  parent.host.renderAbsolute(option.max),
                  label,
                ]);
      },
      onSetMax,
    });
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
