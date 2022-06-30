export type SettingToggle = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;
};

export type SettingTrigger = {
  trigger: number;
  $trigger?: JQuery<HTMLElement>;
};

export abstract class SettingsSection {
  enabled = false;
  $enabled?: JQuery<HTMLElement>;
}
