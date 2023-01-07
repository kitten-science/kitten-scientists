import { UserScript } from "../../UserScript";
import { ListItem } from "./ListItem";

export class LabelListItem extends ListItem {
  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param icon When set to an SVG path, will be used as an icon on the label.
   * @param delimiter Should there be additional padding below this element?
   */
  constructor(
    host: UserScript,
    label: string,
    icon: string | undefined = undefined,
    delimiter = false
  ) {
    super(host, label, delimiter);

    if (icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${icon}"/></svg>`,
      }).addClass("ks-icon-label");
      iconElement.insertBefore(this.elementLabel);
    }
  }
}
