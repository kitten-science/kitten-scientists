import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, type PanelOptions } from "./CollapsiblePanel.js";
import { type LabelListItemOptions } from "./LabelListItem.js";
export type IconSettingsPanelOptions = LabelListItemOptions &
  PanelOptions & {
    /**
     * When set to an SVG path, will be used as an icon on the panel.
     */
    readonly icon: string;
  };
export declare class IconSettingsPanel<
  TSetting extends Setting = Setting,
> extends CollapsiblePanel {
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
  );
}
//# sourceMappingURL=IconSettingsPanel.d.ts.map
