import { Setting } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { LabelListItem } from "./LabelListItem";
import { Panel } from "./Panel";

export class IconSettingsPanel<TSetting extends Setting = Setting> extends Panel {
  readonly setting: TSetting;

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param icon SVG path
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(
    host: UserScript,
    label: string,
    setting: TSetting,
    icon: string | undefined,
    initiallyExpanded = false
  ) {
    super(host, new LabelListItem(host, label, icon), { initiallyExpanded });
    this.setting = setting;
  }
}
