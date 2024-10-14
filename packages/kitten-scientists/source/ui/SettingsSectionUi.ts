import { BonfireBuildingSetting } from "../settings/BonfireSettings.js";
import { ReligionSettingsItem } from "../settings/ReligionSettings.js";
import { Setting, SettingMax } from "../settings/Settings.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

/**
 * Base class for UI sections.
 * This exists mostly for historic reasons. New implementations likely want to use
 * `SettingsPanel` or `Panel` directly.
 */
export abstract class AbstractBuildSettingsPanel<
  TSetting extends Setting = Setting,
> extends SettingsPanel<TSetting> {
  protected _getBuildOption(
    option: BonfireBuildingSetting | ReligionSettingsItem | SettingMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingMaxListItem(this._host, label, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
      upgradeIndicator,
    });
  }
}
