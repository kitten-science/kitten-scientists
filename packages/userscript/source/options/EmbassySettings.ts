import { Race } from "../types";
import { SettingMax } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";

export class EmbassySettings extends SettingsSectionTrigger {
  items: {
    [item in Race]: SettingMax;
  } = {
    dragons: new SettingMax(true),
    griffins: new SettingMax(true),
    leviathans: new SettingMax(true),
    lizards: new SettingMax(true),
    nagas: new SettingMax(true),
    sharks: new SettingMax(true),
    spiders: new SettingMax(true),
    zebras: new SettingMax(true),
  };
}
