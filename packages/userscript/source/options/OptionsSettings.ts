import { SettingsSection } from "./SettingsSection";

export type OptionsItem =
  | "_steamworks"
  | "autofeed"
  | "buildEmbassies"
  | "crypto"
  | "explore"
  | "festival"
  | "fixCry"
  | "hunt"
  | "observe"
  | "promote"
  | "shipOverride"
  | "style";

export type OptionsSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

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
    buildEmbassies: { enabled: true, subTrigger: 0.9 },
    style: { enabled: true },
    explore: { enabled: false },
    _steamworks: { enabled: false },
  };
}
