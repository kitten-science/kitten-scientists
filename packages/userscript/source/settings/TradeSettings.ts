import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Race, Season } from "../types";
import { EmbassySettings } from "./EmbassySettings";
import {
  Requirement,
  Setting,
  SettingBuySellTrigger,
  SettingLimited,
  SettingTrigger,
} from "./Settings";

export class TradeSettingsItem extends SettingLimited {
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
    require: Requirement = false
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

export type TradeSettingsItems = {
  [item in Race]: TradeSettingsItem;
};

export class TradeSettings extends SettingTrigger {
  races: TradeSettingsItems;

  feedLeviathans: Setting;
  buildEmbassies: EmbassySettings;
  tradeBlackcoin: SettingBuySellTrigger;
  unlockRaces: Setting;

  constructor(
    enabled = false,
    trigger = 1,
    races = {
      dragons: new TradeSettingsItem("dragons", true, true, true, true, true, true, "titanium"),
      griffins: new TradeSettingsItem("griffins", true, true, false, true, false, false, "wood"),
      leviathans: new TradeSettingsItem(
        "leviathans",
        true,
        true,
        true,
        true,
        true,
        true,
        "unobtainium"
      ),
      lizards: new TradeSettingsItem("lizards", true, true, true, false, false, false, "minerals"),
      nagas: new TradeSettingsItem("nagas", true, true, true, false, false, true),
      sharks: new TradeSettingsItem("sharks", true, true, false, false, true, false, "iron"),
      spiders: new TradeSettingsItem("spiders", true, true, true, true, false, true),
      zebras: new TradeSettingsItem("zebras", true, true, true, true, true, true),
    },
    buildEmbassies = new EmbassySettings(),
    feedLeviathans = new Setting(false),
    tradeBlackcoin = new SettingBuySellTrigger(false, 1090.0, 1095.0, 10000),
    unlockRaces = new Setting(true)
  ) {
    super(enabled, trigger);
    this.races = races;

    this.buildEmbassies = buildEmbassies;
    this.feedLeviathans = feedLeviathans;
    this.tradeBlackcoin = tradeBlackcoin;
    this.unlockRaces = unlockRaces;
  }

  load(settings: Maybe<Partial<TradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.races, settings.races, (race, item) => {
      race.enabled = item?.enabled ?? race.enabled;
      race.limited = item?.limited ?? race.limited;
      race.seasons.autumn.enabled = item?.seasons?.autumn.enabled ?? race.seasons.autumn.enabled;
      race.seasons.spring.enabled = item?.seasons?.spring.enabled ?? race.seasons.spring.enabled;
      race.seasons.summer.enabled = item?.seasons?.summer.enabled ?? race.seasons.summer.enabled;
      race.seasons.winter.enabled = item?.seasons?.winter.enabled ?? race.seasons.winter.enabled;
    });

    this.buildEmbassies.load(settings.buildEmbassies);
    this.feedLeviathans.load(settings.feedLeviathans);
    this.tradeBlackcoin.load(settings.tradeBlackcoin);
    this.unlockRaces.load(settings.unlockRaces);
  }
}
