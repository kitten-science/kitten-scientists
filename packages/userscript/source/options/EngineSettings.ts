import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { SettingsSection } from "./SettingsSection";

export class EngineSettings extends SettingsSection {
  filters = new FilterSettings();

  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  options = new OptionsSettings();
}
