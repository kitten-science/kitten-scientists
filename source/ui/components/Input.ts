import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type InputOptions = UiComponentOptions & {
  readonly onChange?: (value: string) => void;
  readonly onEnter?: (currentValue: string) => void;
  readonly onEscape?: (currentValue: string) => void;
  readonly selected?: boolean;
  readonly value?: string;
  readonly classes?: Array<string>;
} & ThisType<Input>;

export class Input extends UiComponent {
  declare readonly _options: InputOptions;
  readonly element: JQuery<HTMLInputElement>;

  /**
   * Constructs an input field.
   *
   * @param host - A reference to the host.
   * @param label - The label on the input element.
   * @param options - Options for the UI element.
   */
  constructor(host: KittenScientists, options?: InputOptions) {
    super(host, { ...options, children: [] });

    this.element = $<HTMLInputElement>('<input type="text"/>').addClass("ks-input");

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }

    if (options?.onChange) {
      this.element.on("change", () => options.onChange?.(this.element[0].value));
    }

    if (options?.value) {
      this.element[0].value = options.value;
    }

    if (options?.selected) {
      this.element[0].selectionStart = 0;
      this.element[0].selectionEnd = -1;
    }

    this.element.on("keyup", (event: JQuery.KeyUpEvent) => {
      switch (event.key) {
        case "Enter":
          options?.onEnter?.(this.element[0].value);
          break;
        case "Escape":
          options?.onEscape?.(this.element[0].value);
          break;
      }
    });

    this.addChildren(options?.children);
  }
}
