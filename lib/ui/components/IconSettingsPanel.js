import { CollapsiblePanel } from "./CollapsiblePanel.js";
import { LabelListItem } from "./LabelListItem.js";
export class IconSettingsPanel extends CollapsiblePanel {
  setting;
  /**
   * Constructs a settings panel that can have an icon.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param options Options for the panel.
   */
  constructor(host, label, setting, options) {
    super(
      host,
      new LabelListItem(host, label, { childrenHead: options?.childrenHead, icon: options?.icon }),
      {
        initiallyExpanded: options?.initiallyExpanded,
      },
    );
    this.setting = setting;
  }
}
//# sourceMappingURL=IconSettingsPanel.js.map
