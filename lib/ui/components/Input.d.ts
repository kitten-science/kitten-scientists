import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type InputOptions = UiComponentOptions & {
  readonly onChange?: (value: string) => void;
  readonly onEnter?: (currentValue: string) => void;
  readonly onEscape?: (currentValue: string) => void;
  readonly selected?: boolean;
  readonly value?: string;
};
export declare class Input extends UiComponent {
  readonly element: JQuery<HTMLInputElement>;
  /**
   * Constructs an input field.
   *
   * @param host - A reference to the host.
   * @param label - The label on the input element.
   * @param options - Options for the UI element.
   */
  constructor(host: KittenScientists, options?: Partial<InputOptions>);
}
//# sourceMappingURL=Input.d.ts.map
