export type SettingLimit = {
  max: number;
  $max?: JQuery<HTMLElement>;
};

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

export const intersect = <T>(a: Array<T>, b: Array<T>) => {
  return a.filter(x => b.includes(x));
};
export const difference = <T>(a: Array<T>, b: Array<T>) => {
  return a.filter(x => !b.includes(x));
};
