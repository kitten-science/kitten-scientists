import { isNil } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export type TextButtonOptions = {
  readonly title: string;
  readonly onClick: () => void;
};

export class TextButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;
  readOnly: boolean;

  constructor(host: UserScript, label: string, options?: Partial<TextButtonOptions>) {
    super(host);

    const element = $("<div/>").addClass("ks-text-button").text(label);

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
    this.readOnly = false;
  }
}
