import type { SupportedLocale } from "../Engine.js";
import { ksVersion } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import type { EngineSettings } from "../settings/EngineSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
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
import type { UiComponent } from "./components/UiComponent.js";

export class InternalsUi extends SettingsPanel<EngineSettings> {
  constructor(
    parent: UiComponent,
    settings: EngineSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    super(
      parent,
      settings,
      new LabelListItem(parent, parent.host.engine.i18n("ui.internals"), {
        childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.Settings,
      }),
      {
        children: [
          new SettingsList(parent, {
            children: [
              new ButtonListItem(
                parent,
                new TextButton(
                  parent,
                  parent.host.engine.i18n("ui.internals.interval", [settings.interval]),
                  {
                    onClick: async () => {
                      const value = await Dialog.prompt(
                        parent,
                        parent.host.engine.i18n("ui.internals.interval.prompt"),
                        parent.host.engine.i18n("ui.internals.interval.promptTitle", [
                          parent.host.renderAbsolute(settings.interval, locale.selected),
                        ]),
                        parent.host.renderAbsolute(settings.interval),
                        parent.host.engine.i18n("ui.internals.interval.promptExplainer"),
                      );

                      if (value === undefined || value === "" || value.startsWith("-")) {
                        return;
                      }

                      if (value === "0") {
                        settings.enabled = false;
                      }

                      settings.interval = parent.host.parseAbsolute(value) ?? settings.interval;
                    },
                    onRefresh() {
                      this.element.text(
                        parent.host.engine.i18n("ui.internals.interval", [settings.interval]),
                      );
                    },
                  },
                ),
              ),
              new Delimiter(parent),

              new SettingListItem(
                parent,
                settings.ksColumn,
                parent.host.engine.i18n("ui.ksColumn"),
                {
                  onCheck: () => {
                    parent.host.rebuildUi();
                  },
                  onUnCheck: () => {
                    parent.host.rebuildUi();
                  },
                },
              ),
              new Delimiter(parent),

              new OptionsListItem(parent, parent.host.engine.i18n("ui.language"), settings.locale, {
                onCheck: () => {
                  parent.host.rebuildUi();
                },
              }),
              new Delimiter(parent),

              new LabelListItem(parent, `Kitten Scientists ${ksVersion("v")}`),
            ],
            hasDisableAll: false,
            hasEnableAll: false,
          }),
        ],
      },
    );
  }
}
