import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type IconButtonOptions = UiComponentOptions & {
  readonly readOnly: boolean;
  readonly inactive: boolean;
};
/**
 * A button that is visually represented through an SVG element.
 */
export declare class IconButton extends UiComponent {
  readonly element: JQuery;
  readOnly: boolean;
  inactive: boolean;
  /**
   * Constructs an `IconButton`.
   *
   * @param host A reference to the host.
   * @param pathData The SVG path data of the icon.
   * @param title The `title` of the element.
   * @param options Options for the icon button.
   */
  constructor(
    host: KittenScientists,
    pathData: string,
    title: string,
    options?: Partial<IconButtonOptions>,
  );
  click(): void;
  refreshUi(): void;
}
//# sourceMappingURL=IconButton.d.ts.map
