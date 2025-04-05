import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { ResetResourcesSettings } from "../settings/ResetResourcesSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  constructor(
    parent: UiComponent,
    settings: ResetResourcesSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.resources");
    super(parent, label, settings, {
      childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Resources,
    });

    const resources = parent.host.game.resPool.resources;

    const items = [];
    let lastLabel = resources[0].title;
    for (const resource of [...resources].sort((a, b) =>
      a.title.localeCompare(b.title, locale.selected),
    )) {
      const option = this.setting.resources[resource.name];

      const element = new SettingTriggerListItem(parent, option, locale, ucfirst(resource.title), {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [resource.title]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [resource.title]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
          element.triggerButton.ineffective =
            settings.enabled && option.enabled && option.trigger === -1;
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.float"),
            parent.host.engine.i18n("ui.trigger.build.prompt", [
              resource.title,
              option.trigger !== -1
                ? parent.host.renderAbsolute(option.trigger, locale.selected)
                : parent.host.engine.i18n("ui.trigger.inactive"),
            ]),
            option.trigger !== -1 ? parent.host.renderAbsolute(option.trigger) : "",
            parent.host.engine.i18n("ui.trigger.reset.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            option.trigger = -1;
            option.enabled = false;
            return;
          }

          option.trigger = Number(value);
        },
      });
      element.triggerButton.element.addClass(stylesButton.lastHeadAction);

      if (parent.host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== resource.title[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = resource.title;
    }

    this.addChild(new SettingsList(parent, { children: items }));
  }
}
