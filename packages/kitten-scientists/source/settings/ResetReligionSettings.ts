import { consumeEntriesPedantic } from "../tools/Entries.js";
import { isNil, Maybe } from "../tools/Maybe.js";
import { UnicornItemVariant } from "../types/index.js";
import { FaithItem, UnicornItem } from "./ReligionSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";

export class ResetReligionBuildingSetting extends SettingTrigger {
  readonly #building: FaithItem | UnicornItem;
  readonly #variant: UnicornItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(
    building: FaithItem | UnicornItem,
    variant: UnicornItemVariant,
    enabled = false,
    trigger = 1,
  ) {
    super(enabled, trigger);
    this.#building = building;
    this.#variant = variant;
  }
}

export type ResetReligionBuildingSettings = Record<
  FaithItem | UnicornItem,
  ResetReligionBuildingSetting
>;

export class ResetReligionSettings extends Setting {
  readonly buildings: ResetReligionBuildingSettings;

  constructor(
    enabled = false,
    buildings: ResetReligionBuildingSettings = {
      apocripha: new ResetReligionBuildingSetting(
        "apocripha",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      basilica: new ResetReligionBuildingSetting(
        "basilica",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      blackCore: new ResetReligionBuildingSetting(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackLibrary: new ResetReligionBuildingSetting(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackNexus: new ResetReligionBuildingSetting(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackObelisk: new ResetReligionBuildingSetting(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackPyramid: new ResetReligionBuildingSetting(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      blackRadiance: new ResetReligionBuildingSetting(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blazar: new ResetReligionBuildingSetting(
        "blazar",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      darkNova: new ResetReligionBuildingSetting(
        "darkNova",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      goldenSpire: new ResetReligionBuildingSetting(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      holyGenocide: new ResetReligionBuildingSetting(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      ivoryCitadel: new ResetReligionBuildingSetting(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      ivoryTower: new ResetReligionBuildingSetting(
        "ivoryTower",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      marker: new ResetReligionBuildingSetting("marker", UnicornItemVariant.Ziggurat, false, -1),
      scholasticism: new ResetReligionBuildingSetting(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      singularity: new ResetReligionBuildingSetting(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      skyPalace: new ResetReligionBuildingSetting(
        "skyPalace",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      solarchant: new ResetReligionBuildingSetting(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      solarRevolution: new ResetReligionBuildingSetting(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      stainedGlass: new ResetReligionBuildingSetting(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      sunAltar: new ResetReligionBuildingSetting(
        "sunAltar",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      sunspire: new ResetReligionBuildingSetting(
        "sunspire",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      templars: new ResetReligionBuildingSetting(
        "templars",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      transcendence: new ResetReligionBuildingSetting(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
      ),
      unicornGraveyard: new ResetReligionBuildingSetting(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      unicornNecropolis: new ResetReligionBuildingSetting(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      unicornPasture: new ResetReligionBuildingSetting(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        false,
        -1,
      ),
      unicornTomb: new ResetReligionBuildingSetting(
        "unicornTomb",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      unicornUtopia: new ResetReligionBuildingSetting(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
    },
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: Maybe<Partial<ResetReligionSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.trigger = item?.trigger ?? building.trigger;
    });
  }
}
