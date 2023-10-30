import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { EngineSettings } from "../settings/EngineSettings.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { OptionsListItem } from "./components/OptionsListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextButton } from "./components/TextButton.js";
import { UiComponent } from "./components/UiComponent.js";

export class InternalsUi extends SettingsPanel<EngineSettings> {
  constructor(host: UserScript, settings: EngineSettings) {
    super(host, "Internals", settings, {
      settingItem: new LabelListItem(host, "Internals", { icon: Icons.Settings }),
      children: [
        new SettingsList(host, {
          children: [
            new ButtonListItem(
              host,
              new TextButton(host, `Interval: ${settings.interval}`, {
                onClick: () => {
                  const newInterval = SettingsSectionUi.promptLimit(
                    "Enter a new interval at which KS should run (in milliseconds):",
                    settings.interval.toString(),
                  );
                  if (isNil(newInterval)) {
                    return;
                  }
                  settings.interval = newInterval;
                  this.refreshUi();
                },
                onRefresh: (subject: UiComponent) => {
                  (subject as TextButton).element.text(`Interval: ${settings.interval}`);
                },
              }),
            ),
            new OptionsListItem(host, "Language", settings.language, {
              onCheck: () => {
                this._host.rebuildUi();
              },
            }),
          ],
        }),
      ],
    });
  }
}
