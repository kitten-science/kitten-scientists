import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type DialogOptions = UiComponentOptions & {
  readonly hasCancel?: boolean;
  readonly hasClose?: boolean;
  readonly onCancel?: () => void;
  readonly onConfirm?: (result: string) => void;
  readonly prompt?: boolean;
  readonly promptValue?: string;
  readonly childrenAfterPrompt?: Array<UiComponent>;
};
export declare class Dialog extends UiComponent {
  readonly element: JQuery<HTMLDialogElement>;
  returnValue: string;
  /**
   * Constructs a dialog.
   *
   * @param host - A reference to the host.
   * @param options - Options for the dialog.
   */
  constructor(host: KittenScientists, options?: Partial<DialogOptions>);
  show(): void;
  showModal(): void;
  close(): void;
  static prompt(
    host: KittenScientists,
    text: string,
    title?: string,
    initialValue?: string,
    explainer?: string,
  ): Promise<string | undefined>;
}
//# sourceMappingURL=Dialog.d.ts.map
