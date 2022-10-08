import { objectEntries } from "../tools/Entries";
import { Race } from "../types";
import { EmbassySettings } from "./EmbassySettings";
import { Requirement, Setting, SettingLimited } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export class TradeSettingsItem extends SettingLimited {
  summer: boolean;
  $summer?: JQuery<HTMLElement>;

  autumn: boolean;
  $autumn?: JQuery<HTMLElement>;

  winter: boolean;
  $winter?: JQuery<HTMLElement>;

  spring: boolean;
  $spring?: JQuery<HTMLElement>;

  /**
   * A resource that is required to trade with the race.
   */
  require: Requirement;

  constructor(
    enabled: boolean,
    limited: boolean,
    summer: boolean,
    autumn: boolean,
    winter: boolean,
    spring: boolean,
    require: Requirement = false
  ) {
    super(enabled, limited);

    this.summer = summer;
    this.autumn = autumn;
    this.winter = winter;
    this.spring = spring;
    this.require = require;
  }
}

export type TradeSettingsItems = {
  [item in Race]: TradeSettingsItem;
};

export class TradeSettings extends SettingsSectionTrigger {
  items: TradeSettingsItems = {
    dragons: new TradeSettingsItem(true, true, true, true, true, true, "titanium"),
    zebras: new TradeSettingsItem(true, true, true, true, true, true),
    lizards: new TradeSettingsItem(true, true, true, false, false, false, "minerals"),
    sharks: new TradeSettingsItem(true, true, false, false, true, false, "iron"),
    griffins: new TradeSettingsItem(true, true, false, true, false, false, "wood"),
    nagas: new TradeSettingsItem(true, true, true, false, false, true),
    spiders: new TradeSettingsItem(true, true, true, true, false, true),
    leviathans: new TradeSettingsItem(true, true, true, true, true, true, "unobtainium"),
  };

  buildEmbassies: EmbassySettings;
  unlockRaces: Setting;

  constructor(
    enabled = false,
    trigger = 1,
    items = {
      dragons: new TradeSettingsItem(true, true, true, true, true, true, "titanium"),
      zebras: new TradeSettingsItem(true, true, true, true, true, true),
      lizards: new TradeSettingsItem(true, true, true, false, false, false, "minerals"),
      sharks: new TradeSettingsItem(true, true, false, false, true, false, "iron"),
      griffins: new TradeSettingsItem(true, true, false, true, false, false, "wood"),
      nagas: new TradeSettingsItem(true, true, true, false, false, true),
      spiders: new TradeSettingsItem(true, true, true, true, false, true),
      leviathans: new TradeSettingsItem(true, true, true, true, true, true, "unobtainium"),
    },
    buildEmbassies = new EmbassySettings(),

    unlockRaces = new Setting(true)
  ) {
    super(enabled, trigger);
    this.items = items;
    this.buildEmbassies = buildEmbassies;
    this.unlockRaces = unlockRaces;
  }

  load(settings: TradeSettings) {
    this.enabled = settings.enabled;
    this.trigger = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].limited = item.limited;
      this.items[name].autumn = item.autumn;
      this.items[name].spring = item.spring;
      this.items[name].summer = item.summer;
      this.items[name].winter = item.winter;
    }

    this.buildEmbassies.enabled = settings.buildEmbassies.enabled;
    for (const [name, item] of objectEntries(settings.buildEmbassies.items)) {
      this.buildEmbassies.items[name].enabled = item.enabled;
      this.buildEmbassies.items[name].max = item.max;
    }

    this.unlockRaces.enabled = settings.unlockRaces.enabled;
  }

  static toLegacyOptions(settings: TradeSettings, subject: KittenStorageType) {
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

    subject.items["toggle-buildEmbassies"] = settings.buildEmbassies.enabled;
    for (const [name, item] of objectEntries(settings.buildEmbassies.items)) {
      subject.items[`toggle-build-${name}` as const] = item.enabled;
      subject.items[`set-build-${name}-max` as const] = item.max;
    }

    subject.items["toggle-races"] = settings.unlockRaces.enabled;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TradeSettings();
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

    options.buildEmbassies.enabled =
      subject.items["toggle-buildEmbassies"] ?? options.buildEmbassies.enabled;
    for (const [name, item] of objectEntries(options.buildEmbassies.items)) {
      item.enabled = subject.items[`toggle-build-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-build-${name}-max` as const] ?? item.max;
    }

    options.unlockRaces.enabled = subject.items["toggle-races"] ?? options.unlockRaces.enabled;

    return options;
  }
}
