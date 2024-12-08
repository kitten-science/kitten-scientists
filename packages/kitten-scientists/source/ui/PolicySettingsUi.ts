import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { PolicySettings } from "../settings/PolicySettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    host: KittenScientists,
    settings: PolicySettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.policies");
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
      options,
    );

    const policies = host.game.science.policies.filter(
      policy => !isNil(this.setting.policies[policy.name]),
    );

    const items = [];
    let lastLabel = policies[0].label;
    for (const policy of policies.sort((a, b) => a.label.localeCompare(b.label, locale.selected))) {
      const option = this.setting.policies[policy.name];

      const element = new SettingListItem(host, policy.label, option, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [policy.label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [policy.label]);
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
