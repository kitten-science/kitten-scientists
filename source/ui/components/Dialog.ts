import { coalesceArray } from "@oliversalzburg/js-utils/data/nil.js";
import type { KittenScientists } from "../../KittenScientists.js";
import { Button } from "./Button.js";
import stylesButton from "./Button.module.css";
import { Container } from "./Container.js";
import { Delimiter } from "./Delimiter.js";
import styles from "./Dialog.module.css";
import stylesExplainer from "./ExplainerLiteItem.module.css";
import { HeaderListItem } from "./HeaderListItem.js";
import { Input } from "./Input.js";
import { Paragraph } from "./Paragraph.js";
import stylesToolbarListItem from "./ToolbarListItem.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type DialogOptions = UiComponentOptions & {
  readonly hasCancel?: boolean;
  readonly hasClose?: boolean;
  readonly onCancel?: () => void;
  readonly onConfirm?: (result: string) => void;
  readonly prompt?: boolean;
  readonly promptValue?: string;
  readonly childrenAfterPrompt?: Array<UiComponent>;
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
    super(host, { ...options, children: [] });

    this.element = $<HTMLDialogElement>("<dialog/>")
      .addClass("dialog")
      .addClass("help")
      .addClass(styles.dialog);
    //.addClass(stylesUserInterface.ui);

    if (options?.hasClose !== false) {
      this.addChild(
        new Button(host, "close", null, {
          classes: [styles.close],
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
              onEscape: (_value: string) => {
                this.close();
                options.onCancel?.();
              },
              selected: true,
              value: options.promptValue,
            })
          : undefined,
        ...(options?.childrenAfterPrompt ?? []),
        new Delimiter(host),
        new Container(host, {
          children: coalesceArray([
            new Button(host, "OK", null, {
              classes: [stylesButton.large],
              onClick: () => {
                this.close();
                options?.onConfirm?.(this.returnValue);
              },
            }),
            options?.hasCancel
              ? new Button(host, "Cancel", null, {
                  classes: [stylesButton.large],
                  onClick: () => {
                    this.close();
                    options.onCancel?.();
                  },
                })
              : undefined,
          ]),
          classes: [stylesToolbarListItem.toolbar],
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
    title?: string,
    initialValue?: string,
    explainer?: string,
  ): Promise<string | undefined> {
    return new Promise(resolve => {
      new Dialog(host, {
        children: coalesceArray([
          title ? new HeaderListItem(host, title) : undefined,
          new Paragraph(host, text),
        ]),
        childrenAfterPrompt: explainer
          ? [
              new Container(host, {
                children: [new Paragraph(host, explainer)],
                classes: [stylesExplainer.explainer],
              }),
            ]
          : [],
        hasCancel: true,
        hasClose: false,
        onCancel: () => {
          resolve(undefined);
        },
        onConfirm: (result: string) => {
          resolve(result);
        },
        prompt: true,
        promptValue: initialValue,
      }).showModal();
    });
  }
}
