import type { KittenScientists } from "../../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "../UiComponent.js";
export declare class ExpandoButton extends UiComponent {
  readonly element: JQuery;
  ineffective: boolean;
  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param options Options for this expando.
   */
  constructor(host: KittenScientists, options?: Partial<UiComponentOptions>);
  setCollapsed(): void;
  setExpanded(): void;
  refreshUi(): void;
}
//# sourceMappingURL=ExpandoButton.d.ts.map
