import { Race } from "../types";
import { Requirement } from "./Options";
import { SettingsSection } from "./SettingsSection";

export type TradingSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  limited: boolean;
  $limited?: JQuery<HTMLElement>;

  summer: boolean;
  $summer?: JQuery<HTMLElement>;

  autumn: boolean;
  $autumn?: JQuery<HTMLElement>;

  winter: boolean;
  $winter?: JQuery<HTMLElement>;

  spring: boolean;
  $spring?: JQuery<HTMLElement>;

  require: Requirement;
};
export class TradingSettings extends SettingsSection {
  trigger = 0.98;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in Race]: TradingSettingsItem;
  } = {
    dragons: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
      require: "titanium",
    },
    zebras: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
      require: false,
    },
    lizards: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: false,
      winter: false,
      spring: false,
      require: "minerals",
    },
    sharks: {
      enabled: true,
      limited: true,
      summer: false,
      autumn: false,
      winter: true,
      spring: false,
      require: "iron",
    },
    griffins: {
      enabled: true,
      limited: true,
      summer: false,
      autumn: true,
      winter: false,
      spring: false,
      require: "wood",
    },
    nagas: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: false,
      winter: false,
      spring: true,
      require: false,
    },
    spiders: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: false,
      spring: true,
      require: false,
    },
    leviathans: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
      require: "unobtainium",
    },
  };
}
