export type SettingToggle = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;
};

export abstract class SettingsSection {
  enabled = false;
  $enabled?: JQuery<HTMLElement>;
}
