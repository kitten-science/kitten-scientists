import { Race } from "../types";

export type TradingSettingsItem = {
  enabled: boolean;
  limited: boolean;
  summer: boolean;
  autumn: boolean;
  winter: boolean;
  spring: boolean;
};
export class TradingSettings {
  enabled = false;
  trigger = 0.98;

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
    },
    zebras: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    lizards: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: false,
      winter: false,
      spring: false,
    },
    sharks: {
      enabled: true,
      limited: true,
      summer: false,
      autumn: false,
      winter: true,
      spring: false,
    },
    griffins: {
      enabled: true,
      limited: true,
      summer: false,
      autumn: true,
      winter: false,
      spring: false,
    },
    nagas: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: false,
      winter: false,
      spring: true,
    },
    spiders: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: false,
      spring: true,
    },
    leviathans: {
      enabled: true,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
  };
}
