import { SettingsSection, SettingToggle } from "./SettingsSection";

export type OptionsItem =
  | "_steamworks"
  | "autofeed"
  | "crypto"
  | "festival"
  | "fixCry"
  | "hunt"
  | "observe"
  | "promote"
  | "shipOverride";

export type OptionsSettingsItem = SettingToggle & {
  subTrigger?: number;
  $subTrigger?: JQuery<HTMLElement>;
};
export class OptionsSettings extends SettingsSection {
  items: {
    [key in OptionsItem]: OptionsSettingsItem;
  } = {
    observe: { enabled: true },
    festival: { enabled: true },
    shipOverride: { enabled: true },
    autofeed: { enabled: true },
    hunt: { enabled: true, subTrigger: 0.98 },
    promote: { enabled: true },
    crypto: { enabled: true, subTrigger: 10000 },
    fixCry: { enabled: false },
    _steamworks: { enabled: false },
  };
}
