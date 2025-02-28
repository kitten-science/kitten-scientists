import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
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

export class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetResourcesSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Resources,
    });

    const resources = host.game.resPool.resources;

    const items = [];
    let lastLabel = resources[0].title;
    for (const resource of [...resources].sort((a, b) =>
      a.title.localeCompare(b.title, locale.selected),
    )) {
      const option = this.setting.resources[resource.name];

      const element = new SettingTriggerListItem(host, option, locale, ucfirst(resource.title), {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [resource.title]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [resource.title]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
          element.triggerButton.ineffective =
            settings.enabled && option.enabled && option.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.float"),
            host.engine.i18n("ui.trigger.build.prompt", [
              resource.title,
              option.trigger !== -1
                ? host.renderAbsolute(option.trigger, locale.selected)
                : host.engine.i18n("ui.trigger.inactive"),
            ]),
            option.trigger !== -1 ? host.renderAbsolute(option.trigger) : "",
            host.engine.i18n("ui.trigger.reset.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                option.trigger = -1;
                option.enabled = false;
                return;
              }

              option.trigger = Number(value);
            })
            .then(() => {
              element.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      });
      element.triggerButton.element.addClass(stylesButton.lastHeadAction);

      if (host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== resource.title[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = resource.title;
    }

    this.addChild(new SettingsList(host, { children: items }));
  }
}
