import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../../KittenScientists.js";
import stylesTextButton from "./TextButton.module.css";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type TextButtonOptions = UiComponentOptions & {
  readonly title: string;
  readonly onClick: () => void;
};

export class TextButton extends UiComponent {
  readonly element: JQuery;
  readOnly: boolean;

  constructor(host: KittenScientists, label?: string, options?: Partial<TextButtonOptions>) {
    super(host, options);

    const element = $("<div/>").addClass(stylesTextButton.textButton);
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
      this.element.addClass("ks-readonly");
    } else {
      this.element.removeClass("ks-readonly");
    }
  }
}
