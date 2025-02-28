import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type TextButtonOptions = UiComponentOptions & {
  readonly title: string;
  readonly onClick: () => void;
};
export declare class TextButton extends UiComponent {
  readonly element: JQuery;
  readOnly: boolean;
  constructor(host: KittenScientists, label?: string, options?: Partial<TextButtonOptions>);
  click(): void;
  refreshUi(): void;
}
//# sourceMappingURL=TextButton.d.ts.map
