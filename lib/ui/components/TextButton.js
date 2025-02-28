import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import stylesButton from "./Button.module.css";
import styles from "./TextButton.module.css";
import { UiComponent } from "./UiComponent.js";
export class TextButton extends UiComponent {
  element;
  readOnly;
  constructor(host, label, options) {
    super(host, options);
    const element = $("<div/>").addClass(styles.textButton);
    if (label !== undefined) {
      element.text(label);
    }
    const title = options?.title;
    if (!isNil(title)) {
      element.prop("title", title);
    }
    this.element = element;
    this.addChildren(options?.children);
    this.readOnly = false;
    this.element.on("click", () => {
      this.click();
    });
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
      this.element.addClass(stylesButton.readonly);
    } else {
      this.element.removeClass(stylesButton.readonly);
    }
  }
}
//# sourceMappingURL=TextButton.js.map
