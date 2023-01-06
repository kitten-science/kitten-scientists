import { BonfireBuildingSetting } from "../settings/BonfireSettings";
import { ReligionSettingsItem } from "../settings/ReligionSettings";
import { Setting, SettingMax } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export type Toggleable = {
  get isExpanded(): boolean;
  toggle: (expand: boolean | undefined) => void;
};

/**
 * Base class for UI sections.
 * This exists mostly for historic reasons. New implementations likely want to use
 * `SettingsPanel` or `Panel` directly.
 */
export abstract class SettingsSectionUi<
  TSetting extends Setting = Setting
> extends SettingsPanel<TSetting> {
  constructor(host: UserScript, label: string, settings: TSetting, initiallyExpanded = false) {
    super(host, label, settings, { initiallyExpanded });
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
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      },
      delimiter,
      upgradeIndicator
    );
  }
}
