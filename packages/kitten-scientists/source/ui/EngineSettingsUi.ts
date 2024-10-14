import { KittenScientists } from "../KittenScientists.js";
import { EngineSettings } from "../settings/EngineSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ExpandoButton } from "./components/buttons-icon/ExpandoButton.js";
import { SettingListItem } from "./components/SettingListItem.js";

export class EngineSettingsUi extends SettingListItem {
  readonly expando: ExpandoButton;

  constructor(host: KittenScientists, settings: EngineSettings) {
    const label = ucfirst(host.engine.i18n("ui.engine"));
    super(host, label, settings, {
      onCheck: () => {
        host.engine.start(true);
      },
      onUnCheck: () => {
        host.engine.stop(true);
      },
    });

    this.expando = new ExpandoButton(host);
    this.head.addChild(this.expando);
  }
}
