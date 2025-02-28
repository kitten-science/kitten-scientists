import { UiComponent } from "./UiComponent.js";
export class Input extends UiComponent {
  element;
  /**
   * Constructs an input field.
   *
   * @param host - A reference to the host.
   * @param label - The label on the input element.
   * @param options - Options for the UI element.
   */
  constructor(host, options) {
    super(host, { ...options, children: [], classes: [] });
    this.element = $('<input type="text"/>').addClass("ks-input");
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
    this.element.on("keyup", event => {
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
//# sourceMappingURL=Input.js.map
