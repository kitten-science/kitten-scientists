import { KittenScientists } from "../../KittenScientists.js";
import { Button } from "./Button.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export class Dialog extends UiComponent {
  readonly element: JQuery<HTMLDialogElement>;

  /**
   * Constructs a dialog.
   *
   * @param host - A reference to the host.
   * @param options - Options for the dialog.
   */
  constructor(host: KittenScientists, options?: Partial<UiComponentOptions>) {
    super(host, options);

    this.element = $<HTMLDialogElement>("<dialog/>").addClass("dialog").addClass("help");
    this.addChild(
      new Button(host, "close", null, {
        onClick: () => {
          this.close();
        },
      }),
    );
    this.addChildren(options?.children);
  }

  show() {
    $("#gamePageContainer").append(this.element);
    this.element[0].showModal();
  }
  close() {
    this.element[0].close();
    this.element.remove();
  }
}
