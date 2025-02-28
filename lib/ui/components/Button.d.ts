import type { KittenScientists } from "../../KittenScientists.js";
import type { IconButtonOptions } from "./IconButton.js";
import { UiComponent } from "./UiComponent.js";
export type ButtonOptions = IconButtonOptions & {
  readonly border: boolean;
  readonly alignment: "left" | "right";
  readonly title: string;
};
/**
 * A button that has a label and can optionally have an SVG icon.
 */
export declare class Button extends UiComponent {
  readonly _options: Partial<ButtonOptions>;
  protected readonly _iconElement: JQuery | undefined;
  readonly element: JQuery;
  readOnly: boolean;
  inactive: boolean;
  ineffective: boolean;
  /**
   * Constructs a `Button`.
   *
   * @param host - A reference to the host.
   * @param label - The text to display on the button.
   * @param pathData - The SVG path data of the icon.
   * @param options - Options for the icon button.
   */
  constructor(
    host: KittenScientists,
    label: string,
    pathData?: string | null,
    options?: Partial<ButtonOptions>,
  );
  updateLabel(label: string): void;
  updateTitle(title: string): void;
  click(): void;
  refreshUi(): void;
}
//# sourceMappingURL=Button.d.ts.map
