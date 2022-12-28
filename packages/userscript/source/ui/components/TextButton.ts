import { isNil } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class TextButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;
  readOnly: boolean;

  constructor(
    host: UserScript,
    label: string,
    title?: string,
    handler: { readonly onClick?: () => void } = {}
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-text-button").text(label);

    if (!isNil(title)) {
      element.prop("title", title);
    }

    if (!isNil(handler.onClick)) {
      element.on("click", () => {
        if (this.readOnly) {
          return;
        }

        if (!isNil(handler.onClick)) {
          handler.onClick();
        }
      });
    }

    this.element = element;
    this.readOnly = false;
  }
}
