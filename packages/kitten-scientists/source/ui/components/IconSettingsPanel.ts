import { KittenScientists } from "../../KittenScientists.js";
import { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, PanelOptions } from "./CollapsiblePanel.js";
import { LabelListItem, LabelListItemOptions } from "./LabelListItem.js";

export type IconSettingsPanelOptions = LabelListItemOptions &
  PanelOptions & {
    /**
     * When set to an SVG path, will be used as an icon on the panel.
     */
    readonly icon: string;
  };

export class IconSettingsPanel<TSetting extends Setting = Setting> extends CollapsiblePanel {
  readonly setting: TSetting;

  /**
   * Constructs a settings panel that can have an icon.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param options Options for the panel.
   */
  constructor(
    host: KittenScientists,
    label: string,
    setting: TSetting,
    options?: Partial<IconSettingsPanelOptions>,
  ) {
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
