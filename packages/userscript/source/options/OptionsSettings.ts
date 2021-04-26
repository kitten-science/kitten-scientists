export type OptionsSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
export class OptionsSettings {
  enabled = false;

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
    observe: { enabled: false },
    festival: { enabled: false },
    shipOverride: { enabled: false },
    autofeed: { enabled: false },
    hunt: { enabled: false },
    promote: { enabled: false },
    crypto: { enabled: false },
    fixCry: { enabled: false },
    buildEmbassies: { enabled: false },
    style: { enabled: false },
    explore: { enabled: false },
    _steamworks: { enabled: false },
  };
}
