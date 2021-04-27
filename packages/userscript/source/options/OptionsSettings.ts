import { SettingsSection } from "./SettingsSection";

export type OptionsSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  subTrigger?: number;
  $subTrigger?: JQuery<HTMLElement>;
};
export class OptionsSettings extends SettingsSection {
  items: {
    observe: OptionsSettingsItem;
    festival: OptionsSettingsItem;
    shipOverride: OptionsSettingsItem;
    autofeed: OptionsSettingsItem;
    hunt: OptionsSettingsItem;
    promote: OptionsSettingsItem;
    crypto: OptionsSettingsItem;
    fixCry: OptionsSettingsItem;
    buildEmbassies: OptionsSettingsItem;
    style: OptionsSettingsItem;
    explore: OptionsSettingsItem;
    _steamworks: OptionsSettingsItem;
  } = {
    observe: { enabled: true },
    festival: { enabled: true },
    shipOverride: { enabled: true },
    autofeed: { enabled: true },
    hunt: { enabled: true, subTrigger: 0.98 },
    promote: { enabled: true },
    crypto: { enabled: true, subTrigger: 10000 },
    fixCry: { enabled: false },
    buildEmbassies: { enabled: true, subTrigger: 0.9 },
    style: { enabled: true },
    explore: { enabled: false },
    _steamworks: { enabled: false },
  };
}
