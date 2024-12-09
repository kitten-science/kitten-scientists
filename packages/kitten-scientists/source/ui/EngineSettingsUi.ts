import { KittenScientists } from "../KittenScientists.js";
import { EngineSettings } from "../settings/EngineSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ExpandoButton } from "./components/buttons/ExpandoButton.js";
import { Container } from "./components/Container";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";

export class EngineSettingsUi extends SettingListItem {
  readonly expando: ExpandoButton;

  constructor(host: KittenScientists, settings: EngineSettings) {
    const label = ucfirst(host.engine.i18n("ui.engine"));
    super(host, settings, label, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
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
