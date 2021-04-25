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
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    zebras: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    lizards: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    sharks: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    griffins: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    nagas: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    spiders: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
    leviathans: {
      enabled: false,
      limited: true,
      summer: true,
      autumn: true,
      winter: true,
      spring: true,
    },
  };
}
