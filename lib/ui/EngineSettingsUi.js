import { ucfirst } from "../tools/Format.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { ExpandoButton } from "./components/buttons/ExpandoButton.js";
export class EngineSettingsUi extends SettingListItem {
  expando;
  constructor(host, settings) {
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
//# sourceMappingURL=EngineSettingsUi.js.map
