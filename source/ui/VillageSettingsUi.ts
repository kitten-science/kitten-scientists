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
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
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
  ) {
    const label = parent.host.engine.i18n("ui.distribute");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
    );

    const listJobs = new SettingsList(this).addChildren(
      this.host.game.village.jobs
        .filter(item => !isNil(this.setting.jobs[item.name]))
        .map(job =>
          this._getDistributeOption(
            this.setting.jobs[job.name],
            locale.selected,
            settings,
            job.title,
          ),
        ),
    );
    this.addChild(listJobs);

    const listAddition = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listAddition.addChild(new HeaderListItem(this, this.host.engine.i18n("ui.additional")));

    this._hunt = new SettingTriggerListItem(
      this,
      this.setting.hunt,
      locale,
      this.host.engine.i18n("option.hunt"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [this.host.engine.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [this.host.engine.i18n("option.hunt")]);
        },
        onRefresh: () => {
          this._hunt.triggerButton.inactive = !this.setting.hunt.enabled;
          this._hunt.triggerButton.ineffective =
            this.setting.enabled && this.setting.hunt.enabled && this.setting.hunt.trigger === -1;
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            this,
            this.host.engine.i18n("ui.trigger.prompt.percentage"),
            this.host.engine.i18n("ui.trigger.hunt.prompt", [
              this.host.renderPercentage(this.setting.hunt.trigger, locale.selected, true),
            ]),
            this.host.renderPercentage(this.setting.hunt.trigger),
            this.host.engine.i18n("ui.trigger.hunt.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.hunt.trigger = this.host.parsePercentage(value);
        },
      },
    );
    this._hunt.triggerButton.element.addClass(stylesButton.lastHeadAction);
    listAddition.addChild(this._hunt);

    this._festivals = new SettingListItem(
      this,
      this.setting.holdFestivals,
      this.host.engine.i18n("option.festival"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [
            this.host.engine.i18n("option.festival"),
          ]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [
            this.host.engine.i18n("option.festival"),
          ]);
        },
      },
    );
    listAddition.addChild(this._festivals);

    this._promoteKittens = new SettingTriggerListItem(
      this,
      this.setting.promoteKittens,
      locale,
      this.host.engine.i18n("option.promotekittens"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [
            this.host.engine.i18n("option.promotekittens"),
          ]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [
            this.host.engine.i18n("option.promotekittens"),
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
            this,
            this.host.engine.i18n("ui.trigger.promoteKittens.promptTitle"),
            this.host.engine.i18n("ui.trigger.promoteKittens.prompt", [
              this.host.renderPercentage(
                this.setting.promoteKittens.trigger,
                locale.selected,
                true,
              ),
            ]),
            this.host.renderPercentage(this.setting.promoteKittens.trigger),
            this.host.engine.i18n("ui.trigger.promoteKittens.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.promoteKittens.trigger = this.host.parsePercentage(value);
        },
      },
    );
    this._promoteKittens.triggerButton.element.addClass(stylesButton.lastHeadAction);
    listAddition.addChild(this._promoteKittens);

    this._promoteLeader = new SettingListItem(
      this,
      this.setting.promoteLeader,
      this.host.engine.i18n("option.promote"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [this.host.engine.i18n("option.promote")]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [
            this.host.engine.i18n("option.promote"),
          ]);
        },
      },
    );
    listAddition.addChild(this._promoteLeader);

    for (const option of this.setting.electLeader.job.options) {
      if (option.value === "any") {
        option.label = this.host.engine.i18n("option.elect.job.any");
      } else {
        option.label = this.host.engine.i18n(`$village.job.${option.value}`);
      }
    }

    for (const option of this.setting.electLeader.trait.options) {
      option.label = this.host.engine.i18n(`$village.trait.${option.value}`);
    }

    this._electLeader = new SettingListItem(
      this,
      this.setting.electLeader,
      this.host.engine.i18n("option.elect"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [this.host.engine.i18n("option.elect")]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [this.host.engine.i18n("option.elect")]);
        },
      },
    ).addChildren([
      new OptionsListItem(
        this,
        this.host.engine.i18n("option.elect.job"),
        this.setting.electLeader.job,
      ),
      new OptionsListItem(
        this,
        this.host.engine.i18n("option.elect.trait"),
        this.setting.electLeader.trait,
      ),
    ]);
    listAddition.addChild(this._electLeader);

    this.addChild(listAddition);
  }

  private _getDistributeOption(
    option: SettingMax,
    locale: SupportedLocale,
    sectionSetting: VillageSettings,
    label: string,
    delimiter = false,
  ) {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        this,
        this.host.engine.i18n("ui.max.distribute.prompt", [label]),
        this.host.engine.i18n("ui.max.distribute.promptTitle", [
          label,
          this.host.renderAbsolute(option.max, locale),
        ]),
        this.host.renderAbsolute(option.max),
        this.host.engine.i18n("ui.max.distribute.promptExplainer"),
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

      option.max = this.host.parseAbsolute(value) ?? option.max;
    };

    const element = new SettingMaxListItem(this, option, label, {
      delimiter,
      onCheck: (isBatchProcess?: boolean) => {
        this.host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          onSetMax();
        }
      },
      onUnCheck: () => {
        this.host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(this.host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? this.host.engine.i18n("ui.max.distribute.titleInfinite", [label])
            : option.max === 0
              ? this.host.engine.i18n("ui.max.distribute.titleZero", [label])
              : this.host.engine.i18n("ui.max.distribute.title", [
                  this.host.renderAbsolute(option.max),
                  label,
                ]);
      },
      onSetMax,
    }).addChildrenHead([new Container(this, { classes: [stylesLabelListItem.fillSpace] })]);
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
