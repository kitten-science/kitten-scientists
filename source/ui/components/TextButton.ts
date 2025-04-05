import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import stylesButton from "./Button.module.css";
import styles from "./TextButton.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type TextButtonOptions = ThisType<TextButton> &
  UiComponentOptions & {
    readonly title?: string;
  };

export class TextButton extends UiComponent {
  declare readonly options: TextButtonOptions;
  readonly element: JQuery;
  readOnly: boolean;

  constructor(parent: UiComponent, label?: string, options?: TextButtonOptions) {
    super(parent, { ...options });

    const element = $("<div/>").addClass(styles.textButton);
    if (label !== undefined) {
      element.text(label);
    }

    const title = options?.title;
    if (!isNil(title)) {
      element.prop("title", title);
    }

    this.element = element;
    this.addChildren(options?.children);
    this.readOnly = false;

    this.element.on("click", () => {
      this.click();
    });
  }

  override click() {
    if (this.readOnly) {
      return;
    }

    super.click();
  }

  override refreshUi(): void {
    super.refreshUi();

    if (this.readOnly) {
      this.element.addClass(stylesButton.readonly);
    } else {
      this.element.removeClass(stylesButton.readonly);
    }
  }
}
