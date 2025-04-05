import type { EngineSettings } from "../settings/EngineSettings.js";
import { ucfirst } from "../tools/Format.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import { ExpandoButton } from "./components/buttons/ExpandoButton.js";

export class EngineSettingsUi extends SettingListItem {
  readonly expando: ExpandoButton;

  constructor(parent: UiComponent, settings: EngineSettings) {
    const label = ucfirst(parent.host.engine.i18n("ui.engine"));
    super(parent, settings, label, {
      onCheck: () => {
        parent.host.engine.start(true);
      },
      onUnCheck: () => {
        parent.host.engine.stop(true);
      },
    });

    this.expando = new ExpandoButton(this);
    this.addChildrenHead([
      new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
      this.expando,
    ]);
  }
}
