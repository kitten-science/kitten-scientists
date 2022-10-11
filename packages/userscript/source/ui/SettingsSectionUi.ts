import { BonfireBuildingSetting } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { Setting, SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export type Toggleable = {
  get isExpanded(): boolean;
  toggle: (expand: boolean | undefined) => void;
};

/**
 * Base class for all automation UI sections.
 * This provides common functionality to help build the automation sections themselves.
 */
export abstract class SettingsSectionUi<
  TSetting extends Setting = Setting
> extends SettingsPanel<TSetting> {
  constructor(host: UserScript, label: string, settings: TSetting, initiallyExpanded = false) {
    super(host, label, settings, initiallyExpanded);
  }

  protected _getBuildOption(
    option: BonfireBuildingSetting | ReligionSettingsItem | SettingMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingMaxListItem(
      this._host,
      label,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      },
      delimiter,
      upgradeIndicator
    );
  }
}
