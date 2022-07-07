import { objectEntries } from "../tools/Entries";
import { Race } from "../types";
import { Requirement } from "./Options";
import { OptionsSettingsItem } from "./OptionsSettings";
import { SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type TradingSettingsItem = SettingToggle & {
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

export type TradeAdditionSettings = {
  buildEmbassies: OptionsSettingsItem;
  unlockRaces: SettingToggle;
};

export class TradingSettings extends SettingsSection implements SettingTrigger {
  trigger = 0.98;
  $trigger?: JQuery<HTMLElement>;

  addition: TradeAdditionSettings = {
    buildEmbassies: { enabled: true },
    unlockRaces: { enabled: true },
  };

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

  static toLegacyOptions(settings: TradingSettings, subject: KittenStorageType) {
    subject.toggles.trade = settings.enabled;
    subject.triggers.trade = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`toggle-${name}-autumn` as const] = item.autumn;
      subject.items[`toggle-${name}-spring` as const] = item.spring;
      subject.items[`toggle-${name}-summer` as const] = item.summer;
      subject.items[`toggle-${name}-winter` as const] = item.winter;
    }

    subject.items["toggle-buildEmbassies"] = settings.addition.buildEmbassies.enabled;
    subject.items["toggle-races"] = settings.addition.unlockRaces.enabled;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TradingSettings();
    options.enabled = subject.toggles.trade;
    options.trigger = subject.triggers.trade;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
      item.autumn = subject.items[`toggle-${name}-autumn` as const] ?? item.autumn;
      item.spring = subject.items[`toggle-${name}-spring` as const] ?? item.spring;
      item.summer = subject.items[`toggle-${name}-summer` as const] ?? item.summer;
      item.winter = subject.items[`toggle-${name}-winter` as const] ?? item.winter;
    }

    options.addition.buildEmbassies.enabled =
      subject.items["toggle-buildEmbassies"] ?? options.addition.buildEmbassies.enabled;
    options.addition.unlockRaces.enabled =
      subject.items["toggle-races"] ?? options.addition.unlockRaces.enabled;

    return options;
  }
}
