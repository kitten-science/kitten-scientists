import { Race } from "../types";
import { SettingMax } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";

export class EmbassySettings extends SettingsSectionTrigger {
  items: {
    [item in Race]: SettingMax;
  } = {
    dragons: new SettingMax("dragons", true),
    griffins: new SettingMax("griffins", true),
    leviathans: new SettingMax("leviathans", true),
    lizards: new SettingMax("lizards", true),
    nagas: new SettingMax("nagas", true),
    sharks: new SettingMax("sharks", true),
    spiders: new SettingMax("spiders", true),
    zebras: new SettingMax("zebras", true),
  };
}
