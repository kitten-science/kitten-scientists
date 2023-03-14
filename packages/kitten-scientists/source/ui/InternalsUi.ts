import { Icons } from "../images/Icons";
import { EngineSettings } from "../settings/EngineSettings";
import { isNil } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { ButtonListItem } from "./components/ButtonListItem";
import { LabelListItem } from "./components/LabelListItem";
import { OptionsListItem } from "./components/OptionsListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel } from "./components/SettingsPanel";
import { TextButton } from "./components/TextButton";
import { UiComponent } from "./components/UiComponent";
import { SettingsSectionUi } from "./SettingsSectionUi";

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
                    settings.interval.toString()
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
              })
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
