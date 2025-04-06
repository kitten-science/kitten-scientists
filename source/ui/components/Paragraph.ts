import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ParagraphOptions = ThisType<Paragraph> &
  UiComponentOptions & {
    readonly classes?: Array<string>;
  };

export class Paragraph extends UiComponent {
  declare readonly options: ParagraphOptions;
  readonly element: JQuery<HTMLParagraphElement>;

  /**
   * Constructs a paragraph.
   *
   * @param host - A reference to the host.
   * @param text - The text inside the paragraph.
   * @param options - Options for the UI element.
   */
  constructor(parent: UiComponent, text: string, options?: ParagraphOptions) {
    super(parent, { ...options });

    this.element = $<HTMLParagraphElement>("<p/>").text(text);

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
  }

  toString(): string {
    return `[${Paragraph.name}#${this.componentId}]`;
  }
}
