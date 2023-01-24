import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Race } from "../types";
import { SettingMax, SettingTrigger } from "./Settings";

export class EmbassySetting extends SettingMax {
  readonly race: Race;

  constructor(race: Race, enabled = false) {
    super(enabled);
    this.race = race;
  }
}

export type EmbassyRaceSettings = Record<Race, SettingMax>;

export class EmbassySettings extends SettingTrigger {
  races: EmbassyRaceSettings;

  constructor(
    enabled = false,
    races: EmbassyRaceSettings = {
      dragons: new EmbassySetting("dragons", true),
      griffins: new EmbassySetting("griffins", true),
      leviathans: new EmbassySetting("leviathans", true),
      lizards: new EmbassySetting("lizards", true),
      nagas: new EmbassySetting("nagas", true),
      sharks: new EmbassySetting("sharks", true),
      spiders: new EmbassySetting("spiders", true),
      zebras: new EmbassySetting("zebras", true),
    }
  ) {
    super(enabled);
    this.races = races;
  }

  load(settings: Maybe<Partial<EmbassySettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.races, settings.races, (race, item) => {
      race.enabled = item?.enabled ?? race.enabled;
      race.max = item?.max ?? race.max;
    });
  }
}
