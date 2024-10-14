import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../../KittenScientists.js";
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

    const element = $("<div/>").addClass("ks-text-button");
    if (label !== undefined) {
      element.text(label);
    }

    const title = options?.title;
    if (!isNil(title)) {
      element.prop("title", title);
    }

    const onClick = options?.onClick;
    if (!isNil(onClick)) {
      element.on("click", () => {
        if (this.readOnly) {
          return;
        }

        if (!isNil(onClick)) {
          onClick();
        }
      });
    }

    this.element = element;
    this.addChildren(options?.children);
    this.readOnly = false;
  }
}
