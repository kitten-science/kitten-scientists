import { coalesceArray } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../../KittenScientists.js";
import { Button } from "./Button.js";
import { Container } from "./Container.js";
import { Delimiter } from "./Delimiter.js";
import { Input } from "./Input.js";
import { Paragraph } from "./Paragraph.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type DialogOptions = UiComponentOptions & {
  readonly hasCancel?: boolean;
  readonly hasClose?: boolean;
  readonly onCancel?: () => void;
  readonly onConfirm?: (result: string | undefined) => void;
  readonly prompt?: boolean;
  readonly promptValue?: string;
};

export class Dialog extends UiComponent {
  readonly element: JQuery<HTMLDialogElement>;
  returnValue: string;

  /**
   * Constructs a dialog.
   *
   * @param host - A reference to the host.
   * @param options - Options for the dialog.
   */
  constructor(host: KittenScientists, options?: Partial<DialogOptions>) {
    super(host, options);

    this.element = $<HTMLDialogElement>("<dialog/>")
      .addClass("dialog")
      .addClass("help")
      .addClass("ks-dialog")
      .addClass("ks-ui");

    if (options?.hasClose !== false) {
      this.addChild(
        new Button(host, "close", null, {
          classes: ["close"],
          onClick: () => {
            this.close();
            options?.onCancel?.();
          },
        }),
      );
    }

    this.addChildren(options?.children);

    this.returnValue = options?.promptValue ?? "";

    this.addChildren(
      coalesceArray([
        options?.prompt
          ? new Input(host, {
              onChange: (value: string) => {
                this.returnValue = value;
              },
              onEnter: (value: string) => {
                this.returnValue = value;
                this.close();
                options.onConfirm?.(this.returnValue);
              },
              selected: true,
              value: options.promptValue,
            })
          : undefined,
        new Delimiter(host),
        new Container(host, {
          children: coalesceArray([
            new Button(host, "OK", null, {
              classes: ["large"],
              onClick: () => {
                this.close();
                options?.onConfirm?.(this.returnValue);
              },
            }),
            options?.hasCancel
              ? new Button(host, "Cancel", null, {
                  classes: ["large"],
                  onClick: () => {
                    this.close();
                    options.onCancel?.();
                  },
                })
              : undefined,
          ]),
          classes: ["ks-toolbar"],
        }),
      ]),
    );
  }

  show() {
    $("#gamePageContainer").append(this.element);
    this.element[0].show();
  }
  showModal() {
    $("#gamePageContainer").append(this.element);
    this.element[0].showModal();
  }
  close() {
    this.element[0].close();
    this.element.remove();
  }

  static async prompt(
    host: KittenScientists,
    text: string,
    initialValue?: string,
  ): Promise<string | undefined> {
    return new Promise(resolve => {
      new Dialog(host, {
        children: [new Paragraph(host, text)],
        onCancel: () => {
          resolve(undefined);
        },
        onConfirm: (result: string | undefined) => {
          resolve(result);
        },
        prompt: true,
        promptValue: initialValue,
      }).showModal();
    });
  }
}
