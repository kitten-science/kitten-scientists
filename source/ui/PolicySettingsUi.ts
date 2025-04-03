import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { PolicySettings } from "../settings/PolicySettings.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    host: KittenScientists,
    settings: PolicySettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ScienceSettings,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  ) {
    const label = host.engine.i18n("ui.upgrade.policies");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.policies).some(policy => policy.enabled);
        },
      }),
      options,
    );

    const policies = host.game.science.policies.filter(
      policy => !isNil(this.setting.policies[policy.name]),
    );

    const items = [];
    let lastLabel = policies[0].label;
    for (const policy of policies.sort((a, b) => a.label.localeCompare(b.label, locale.selected))) {
      const option = this.setting.policies[policy.name];

      const element = new SettingListItem(host, option, policy.label, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [policy.label]);
          this.refreshUi();
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [policy.label]);
          this.refreshUi();
        },
      });

      if (host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== policy.label[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = policy.label;
    }

    this.addChild(new SettingsList(host, { children: items }));
  }
}
