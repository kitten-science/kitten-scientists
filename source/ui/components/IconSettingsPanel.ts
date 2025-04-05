import type { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, type CollapsiblePanelOptions } from "./CollapsiblePanel.js";
import { LabelListItem, type LabelListItemOptions } from "./LabelListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type IconSettingsPanelOptions = ThisType<IconSettingsPanel> &
  LabelListItemOptions &
  CollapsiblePanelOptions & {
    /**
     * When set to an SVG path, will be used as an icon on the panel.
     */
    readonly icon: string;
  };

export class IconSettingsPanel<TSetting extends Setting = Setting> extends CollapsiblePanel {
  declare readonly options: IconSettingsPanelOptions;
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
    parent: UiComponent,
    label: string,
    setting: TSetting,
    options?: IconSettingsPanelOptions,
  ) {
    super(
      parent,
      new LabelListItem(parent, label, {
        icon: options?.icon,
      }),
      {
        initiallyExpanded: options?.initiallyExpanded,
      },
    );
    this.setting = setting;
  }
}
