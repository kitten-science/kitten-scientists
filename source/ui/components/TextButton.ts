import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import stylesButton from "./Button.module.css";
import styles from "./TextButton.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type TextButtonOptions = ThisType<TextButton> &
  UiComponentOptions & {
    readonly title?: string;
    readonly onClick?: (event?: MouseEvent) => void | Promise<void>;
  };

export class TextButton extends UiComponent {
  declare readonly options: TextButtonOptions;
  readOnly: boolean;

  constructor(parent: UiComponent, label?: string, options?: TextButtonOptions) {
    super(parent, {
      ...options,
      onRefresh: () => {
        if (this.readOnly) {
          this.element.addClass(stylesButton.readonly);
        } else {
          this.element.removeClass(stylesButton.readonly);
        }
      },
    });

    this.element = $("<div/>").addClass(styles.textButton);
    if (label !== undefined) {
      this.element.text(label);
    }

    const title = options?.title;
    if (!isNil(title)) {
      this.element.prop("title", title);
    }

    this.readOnly = false;

    this.element.on("click", () => {
      this.click();
    });
  }

  toString(): string {
    return `[${TextButton.name}#${this.componentId}]`;
  }

  click() {
    if (this.readOnly) {
      return;
    }

    this.requestRefresh();

    return this.options?.onClick?.call(this);
  }
}
