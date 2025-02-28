import type { KittenScientists } from "../../KittenScientists.js";
import { IconButton } from "./IconButton.js";
import { UiComponent, type UiComponentInterface, type UiComponentOptions } from "./UiComponent.js";
export type SettingsListOptions<TChild extends UiComponentInterface = UiComponentInterface> =
  UiComponentOptions<TChild> & {
    readonly hasEnableAll: boolean;
    readonly hasDisableAll: boolean;
    readonly onEnableAll: () => void;
    readonly onDisableAll: () => void;
    readonly onReset: () => void;
  };
/**
 * The `SettingsList` is a `<ul>` designed to host `SettingListItem` instances.
 *
 * It has enable/disable buttons to check/uncheck all settings contained in it.
 * Most commonly, it is used as part of the `SettingsPanel`.
 *
 * This construct is also sometimes referred to as an "items list" for historic reasons.
 */
export declare class SettingsList<
  TOptions extends SettingsListOptions<UiComponent> = SettingsListOptions<UiComponent>,
> extends UiComponent<TOptions> {
  readonly element: JQuery;
  readonly list: JQuery;
  readonly disableAllButton: IconButton | undefined;
  readonly enableAllButton: IconButton | undefined;
  readonly resetButton: IconButton | undefined;
  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param options Which tools should be available on the list?
   */
  constructor(host: KittenScientists, options?: Partial<TOptions>);
  addChild(child: UiComponent): void;
}
//# sourceMappingURL=SettingsList.d.ts.map
