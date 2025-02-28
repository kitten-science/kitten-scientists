import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, type PanelOptions } from "./CollapsiblePanel.js";
import type { LabelListItem } from "./LabelListItem.js";
import type { SettingListItem } from "./SettingListItem.js";
export type SettingsPanelOptions<TListItem extends LabelListItem = LabelListItem> = PanelOptions & {
  readonly settingItem: TListItem;
};
export declare class SettingsPanel<
    TSetting extends Setting = Setting,
    TListItem extends LabelListItem = LabelListItem,
  >
  extends CollapsiblePanel
  implements SettingListItem
{
  readonly setting: TSetting;
  readonly settingItem: TListItem;
  get isExpanded(): boolean;
  get elementLabel(): JQuery<HTMLElement>;
  get head(): LabelListItem<
    import("./LabelListItem.js").LabelListItemOptions<
      import("./UiComponent.js").UiComponent<
        import("./UiComponent.js").UiComponentOptions<
          import("./UiComponent.js").UiComponentInterface
        >
      >
    >
  >;
  get readOnly(): boolean;
  set readOnly(_value: boolean);
  check(): void;
  uncheck(): void;
  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host - A reference to the host.
   * @param settingItem - The UI element to be placed in the head of the panel.
   * @param setting - An setting for which this is the settings panel.
   * @param options - Options for this panel.
   */
  constructor(
    host: KittenScientists,
    setting: TSetting,
    settingItem: TListItem,
    options?: Partial<SettingsPanelOptions<TListItem>>,
  );
}
//# sourceMappingURL=SettingsPanel.d.ts.map
