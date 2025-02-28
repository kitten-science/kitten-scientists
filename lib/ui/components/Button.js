import styles from "./Button.module.css";
import { UiComponent } from "./UiComponent.js";
/**
 * A button that has a label and can optionally have an SVG icon.
 */
export class Button extends UiComponent {
  _iconElement;
  element;
  readOnly;
  inactive;
  ineffective;
  /**
   * Constructs a `Button`.
   *
   * @param host - A reference to the host.
   * @param label - The text to display on the button.
   * @param pathData - The SVG path data of the icon.
   * @param options - Options for the icon button.
   */
  constructor(host, label, pathData = null, options) {
    super(host, { ...options, children: [], classes: [] });
    this.element = $("<div/>", { title: options?.title }).addClass(styles.button).text(label);
    if (options?.border !== false) {
      this.element.addClass(styles.bordered);
    }
    if (options?.alignment === "right") {
      this.element.addClass(styles.alignRight);
    }
    if (pathData !== null) {
      this._iconElement = $(
        `<svg class="${styles.buttonIcon}" style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      );
      if (options?.alignment === "right") {
        this.element.append(this._iconElement);
      } else {
        this.element.prepend(this._iconElement);
      }
    }
    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
    this.element.on("click", () => {
      if (this.readOnly) {
        return;
      }
      this.click();
    });
    this.addChildren(options?.children);
    this.readOnly = options?.readOnly ?? false;
    this.inactive = options?.inactive ?? false;
    this.ineffective = false;
  }
  updateLabel(label) {
    this.element.text(label);
    if (this._iconElement !== undefined) {
      if (this._options.alignment === "right") {
        this.element.append(this._iconElement);
      } else {
        this.element.prepend(this._iconElement);
      }
    }
  }
  updateTitle(title) {
    this.element.prop("title", title);
  }
  click() {
    if (this.readOnly) {
      return;
    }
    super.click();
  }
  refreshUi() {
    super.refreshUi();
    if (this.readOnly) {
      this.element.addClass(styles.readonly);
    } else {
      this.element.removeClass(styles.readonly);
    }
    if (this.inactive) {
      this.element.addClass(styles.inactive);
    } else {
      this.element.removeClass(styles.inactive);
    }
    if (this.ineffective) {
      this.element.addClass(styles.ineffective);
    } else {
      this.element.removeClass(styles.ineffective);
    }
  }
}
//# sourceMappingURL=Button.js.map
