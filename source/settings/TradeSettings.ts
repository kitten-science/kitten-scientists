import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Race, Races, type Season } from "../types/index.js";
import { EmbassySettings } from "./EmbassySettings.js";
import {
  type Requirement,
  Setting,
  SettingBuySellThreshold,
  SettingLimitedTrigger,
  SettingTrigger,
} from "./Settings.js";

export class TradeSettingsItem extends SettingLimitedTrigger {
  readonly #race: Race;
  readonly seasons: Record<Season, Setting>;

  /**
   * A resource that is required to trade with the race.
   */
  readonly #require: Requirement;

  get race() {
    return this.#race;
  }
  get require() {
    return this.#require;
  }

  constructor(
    race: Race,
    enabled: boolean,
    limited: boolean,
    summer: boolean,
    autumn: boolean,
    winter: boolean,
    spring: boolean,
    require: Requirement = false,
  ) {
    super(enabled, limited);
    this.#race = race;
    this.seasons = {
      summer: new Setting(summer),
      autumn: new Setting(autumn),
      winter: new Setting(winter),
      spring: new Setting(spring),
    };
    this.#require = require;
  }
}

export type TradeSettingsItems = Record<Race, TradeSettingsItem>;

export class TradeSettings extends SettingTrigger {
  races: TradeSettingsItems;

  feedLeviathans: Setting;
  buildEmbassies: EmbassySettings;
  tradeBlackcoin: SettingBuySellThreshold;
  unlockRaces: Setting;

  constructor(
    enabled = false,
    trigger = 1,
    buildEmbassies = new EmbassySettings(),
    feedLeviathans = new Setting(),
    tradeBlackcoin = new SettingBuySellThreshold(false, 1090.0, 1095.0, 10000),
    unlockRaces = new Setting(),
  ) {
    super(enabled, trigger);
    this.races = this.initRaces();
    this.buildEmbassies = buildEmbassies;
    this.feedLeviathans = feedLeviathans;
    this.tradeBlackcoin = tradeBlackcoin;
    this.unlockRaces = unlockRaces;
  }

  private initRaces(): TradeSettingsItems {
    const defaultRequire: Partial<Record<Race, Requirement>> = {
      dragons: "titanium",
      griffins: "wood",
      leviathans: "unobtainium",
      lizards: "minerals",
      sharks: "iron",
    };
    const items = {} as TradeSettingsItems;
    for (const item of Races) {
      const require = defaultRequire[item] ?? false;
      items[item] = new TradeSettingsItem(item, false, false, false, false, false, false, require);
    }
    return items;
  }

  load(settings: Maybe<Partial<TradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.races, settings.races, (race, item) => {
      race.enabled = item?.enabled ?? race.enabled;
      race.limited = item?.limited ?? race.limited;
      race.trigger = item?.trigger ?? race.trigger;
      race.seasons.autumn.enabled = item?.seasons.autumn.enabled ?? race.seasons.autumn.enabled;
      race.seasons.spring.enabled = item?.seasons.spring.enabled ?? race.seasons.spring.enabled;
      race.seasons.summer.enabled = item?.seasons.summer.enabled ?? race.seasons.summer.enabled;
      race.seasons.winter.enabled = item?.seasons.winter.enabled ?? race.seasons.winter.enabled;
    });

    this.buildEmbassies.load(settings.buildEmbassies);
    this.feedLeviathans.load(settings.feedLeviathans);
    this.tradeBlackcoin.load(settings.tradeBlackcoin);
    this.unlockRaces.load(settings.unlockRaces);
  }
}
