import type { TranslatedString } from "../../Engine.js";
import styles from "./ExplainerLiteItem.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ExplainerListItemOptions<TKittenGameLiteral extends `$${string}`> = UiComponentOptions &
  ThisType<ExplainerListItem<TKittenGameLiteral>>;

export class ExplainerListItem<TKittenGameLiteral extends `$${string}`> extends UiComponent {
  declare readonly options: ExplainerListItemOptions<TKittenGameLiteral>;
  readonly element: JQuery;

  /**
   * Construct an element to explain an area of the UI.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host - A reference to the host.
   * @param key - The i18n key for the text to appear on the element.
   * @param options - Options for this explainer.
   */
  constructor(
    parent: UiComponent,
    key: TranslatedString<TKittenGameLiteral>,
    options?: ExplainerListItemOptions<TKittenGameLiteral>,
  ) {
    super(parent, { ...options });

    const element = $("<li/>", { text: parent.host.engine.i18n(key) }).addClass(styles.explainer);

    this.element = element;
  }

  toString(): string {
    return `[${ExplainerListItem.name}#${this.componentId}]`;
  }

  refreshUi(): void {}
}
