import { coalesceArray } from "@oliversalzburg/js-utils/data/nil.js";
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
import { UiComponent, type UiComponentInterface, type UiComponentOptions } from "./UiComponent.js";

export type DialogOptions = ThisType<Dialog> &
  UiComponentOptions & {
    readonly hasCancel?: boolean;
    readonly hasClose?: boolean;
    readonly onCancel?: () => void;
    readonly onConfirm?: (result: string) => void;
    readonly prompt?: boolean;
    readonly promptValue?: string;
  };

export class Dialog extends UiComponent {
  declare readonly options: DialogOptions;
  readonly container: Container;
  readonly element: JQuery<HTMLDialogElement>;
  readonly head: Container;
  returnValue: string;

  /**
   * Constructs a dialog.
   *
   * @param host - A reference to the host.
   * @param options - Options for the dialog.
   */
  constructor(parent: UiComponent, options?: DialogOptions) {
    super(parent, { ...options });

    this.element = $<HTMLDialogElement>("<dialog/>")
      .addClass("dialog")
      .addClass("help")
      .addClass(styles.dialog);

    if (options?.hasClose !== false) {
      this.addChild(
        new Button(parent, "close", null, {
          classes: [styles.close],
          onClick: () => {
            this.close();
            options?.onCancel?.();
          },
        }),
      );
    }

    this.returnValue = options?.promptValue ?? "";

    this.head = new Container(parent);
    this.container = new Container(parent);

    this.addChildren(
      coalesceArray([
        this.head,
        options?.prompt
          ? new Input(parent, {
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
        this.container,
        new Delimiter(parent),
        new Container(parent, {
          classes: [stylesToolbarListItem.toolbar],
        }).addChildren(
          coalesceArray([
            new Button(parent, "OK", null, {
              classes: [stylesButton.large],
              onClick: () => {
                this.close();
                options?.onConfirm?.(this.returnValue);
              },
            }),
            options?.hasCancel
              ? new Button(parent, "Cancel", null, {
                  classes: [stylesButton.large],
                  onClick: () => {
                    this.close();
                    options.onCancel?.();
                  },
                })
              : undefined,
          ]),
        ),
      ]),
    );
  }

  toString(): string {
    return `[${Dialog.name}#${this.componentId}]`;
  }

  addChildHead(child: UiComponentInterface): this {
    this.head.addChild(child);
    return this;
  }
  addChildrenHead(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.head.addChild(child);
    }
    return this;
  }

  addChildContent(child: UiComponent): this {
    this.container.addChild(child);
    return this;
  }
  addChildrenContent(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.container.addChild(child);
    }
    return this;
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
    parent: UiComponent,
    text: string,
    title?: string,
    initialValue?: string,
    explainer?: string,
  ): Promise<string | undefined> {
    return new Promise(resolve => {
      new Dialog(parent, {
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
      })
        .addChildrenHead(
          coalesceArray([
            title ? new HeaderListItem(parent, title) : undefined,
            new Paragraph(parent, text),
          ]),
        )
        .addChildrenContent(
          explainer
            ? [
                new Container(parent, {
                  classes: [stylesExplainer.explainer],
                }).addChildren([new Paragraph(parent, explainer)]),
              ]
            : [],
        )
        .showModal();
    });
  }
}
