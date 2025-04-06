import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { PolicySettings } from "../settings/PolicySettings.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    parent: UiComponent,
    settings: PolicySettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ScienceSettings,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.policies");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onRefresh: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.policies).some(policy => policy.enabled);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
    );

    const policies = this.host.game.science.policies.filter(
      policy => !isNil(this.setting.policies[policy.name]),
    );

    const items = [];
    let lastLabel = policies[0].label;
    for (const policy of policies.sort((a, b) => a.label.localeCompare(b.label, locale.selected))) {
      const option = this.setting.policies[policy.name];

      const element = new SettingListItem(this, option, policy.label, {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [policy.label]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [policy.label]);
        },
      });

      if (this.host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== policy.label[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = policy.label;
    }

    this.addChildContent(new SettingsList(this).addChildren(items));
  }
}
