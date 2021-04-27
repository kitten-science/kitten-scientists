import { SpaceItem } from "./Options";
import { SettingsSection } from "./SettingsSection";

export type SpaceSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  max: number;
  $max?: JQuery<HTMLElement>;
};
export class SpaceSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in SpaceItem]: SpaceSettingsItem;
  } = {
    spaceElevator: { enabled: false, max: -1 },
    sattelite: { enabled: false, max: -1 },
    spaceStation: { enabled: false, max: -1 },

    moonOutpost: { enabled: false, max: -1 },
    moonBase: { enabled: false, max: -1 },

    planetCracker: { enabled: false, max: -1 },
    hydrofracturer: { enabled: false, max: -1 },
    spiceRefinery: { enabled: false, max: -1 },

    researchVessel: { enabled: false, max: -1 },
    orbitalArray: { enabled: false, max: -1 },

    sunlifter: { enabled: false, max: -1 },
    containmentChamber: { enabled: false, max: -1 },
    heatsink: { enabled: false, max: -1 },
    sunforge: { enabled: false, max: -1 },

    cryostation: { enabled: false, max: -1 },

    spaceBeacon: { enabled: false, max: -1 },

    terraformingStation: { enabled: false, max: -1 },
    hydroponics: { enabled: false, max: -1 },

    hrHarvester: { enabled: false, max: -1 },

    entangler: { enabled: false, max: -1 },

    tectonic: { enabled: false, max: -1 },
    moltenCore: { enabled: false, max: -1 },
  };
}
