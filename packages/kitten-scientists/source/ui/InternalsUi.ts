import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists, ksVersion } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { EngineSettings } from "../settings/EngineSettings.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextButton } from "./components/TextButton.js";
import { UiComponent } from "./components/UiComponent.js";

export class InternalsUi extends SettingsPanel<EngineSettings> {
  constructor(host: KittenScientists, settings: EngineSettings) {
    super(
      host,
      settings,
      new LabelListItem(host, host.engine.i18n("ui.internals"), {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.Settings,
      }),
      {
        children: [
          new SettingsList(host, {
            children: [
              new ButtonListItem(
                host,
                new TextButton(
                  host,
                  host.engine.i18n("ui.internals.interval", [settings.interval]),
                  {
                    onClick: () => {
                      Dialog.prompt(
                        host,
                        host.engine.i18n("ui.internals.interval.prompt"),
                        host.engine.i18n("ui.internals.interval.promptTitle", [
                          UiComponent.renderAbsolute(settings.interval, host),
                        ]),
                        UiComponent.renderAbsolute(settings.interval, host),
                        host.engine.i18n("ui.internals.interval.promptExplainer"),
                      )
                        .then(value => {
                          if (value === undefined || value === "" || value.startsWith("-")) {
                            return;
                          }

                          if (value === "0") {
                            settings.enabled = false;
                          }

                          settings.interval = UiComponent.parseAbsolute(value) ?? settings.interval;
                        })
                        .then(() => {
                          this.refreshUi();
                        })
                        .catch(redirectErrorsToConsole(console));
                    },
                    onRefresh: (subject: UiComponent) => {
                      (subject as TextButton).element.text(
                        host.engine.i18n("ui.internals.interval", [settings.interval]),
                      );
                    },
                  },
                ),
              ),
              new Delimiter(host),

              new SettingListItem(host, host.engine.i18n("ui.ksColumn"), settings.ksColumn, {
                onCheck: () => {
                  host.rebuildUi();
                },
                onUnCheck: () => {
                  host.rebuildUi();
                },
              }),
              new Delimiter(host),

              new OptionsListItem(host, host.engine.i18n("ui.language"), settings.locale, {
                onCheck: () => {
                  host.rebuildUi();
                },
              }),
              new Delimiter(host),

              new LabelListItem(host, `Kitten Scientists ${ksVersion("v")}`),
            ],
            hasDisableAll: false,
            hasEnableAll: false,
          }),
        ],
      },
    );
  }
}
