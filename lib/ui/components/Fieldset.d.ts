import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type FieldsetOptions = UiComponentOptions & {
  readonly delimiter: boolean;
};
export declare class Fieldset extends UiComponent {
  readonly element: JQuery;
  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host: KittenScientists, label: string, options?: Partial<FieldsetOptions>);
}
//# sourceMappingURL=Fieldset.d.ts.map
