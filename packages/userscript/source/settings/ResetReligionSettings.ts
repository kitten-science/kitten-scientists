import { objectEntries } from "../tools/Entries";
import { UnicornItemVariant } from "../types";
import { FaithItem, UnicornItem } from "./ReligionSettings";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class ResetReligionBuildingSetting extends SettingTrigger {
  readonly building: FaithItem | UnicornItem;
  readonly variant: UnicornItemVariant;

  constructor(
    building: FaithItem | UnicornItem,
    variant: UnicornItemVariant,
    enabled = false,
    trigger = 1
  ) {
    super(enabled, trigger);
    this.building = building;
    this.variant = variant;
  }
}

export class ResetReligionSettings extends Setting {
  readonly buildings: { [item in FaithItem | UnicornItem]: ResetReligionBuildingSetting };

  constructor(
    enabled = false,
    buildings = {
      apocripha: new ResetReligionBuildingSetting(
        "apocripha",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1
      ),
      basilica: new ResetReligionBuildingSetting(
        "basilica",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      blackCore: new ResetReligionBuildingSetting(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      blackLibrary: new ResetReligionBuildingSetting(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      blackNexus: new ResetReligionBuildingSetting(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      blackObelisk: new ResetReligionBuildingSetting(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      blackPyramid: new ResetReligionBuildingSetting(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      blackRadiance: new ResetReligionBuildingSetting(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      blazar: new ResetReligionBuildingSetting(
        "blazar",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      darkNova: new ResetReligionBuildingSetting(
        "darkNova",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      goldenSpire: new ResetReligionBuildingSetting(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      holyGenocide: new ResetReligionBuildingSetting(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      ivoryCitadel: new ResetReligionBuildingSetting(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      ivoryTower: new ResetReligionBuildingSetting(
        "ivoryTower",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      marker: new ResetReligionBuildingSetting("marker", UnicornItemVariant.Ziggurat, false, -1),
      scholasticism: new ResetReligionBuildingSetting(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      singularity: new ResetReligionBuildingSetting(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        false,
        -1
      ),
      skyPalace: new ResetReligionBuildingSetting(
        "skyPalace",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      solarchant: new ResetReligionBuildingSetting(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      solarRevolution: new ResetReligionBuildingSetting(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      stainedGlass: new ResetReligionBuildingSetting(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunAltar: new ResetReligionBuildingSetting(
        "sunAltar",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunspire: new ResetReligionBuildingSetting(
        "sunspire",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      templars: new ResetReligionBuildingSetting(
        "templars",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      transcendence: new ResetReligionBuildingSetting(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      unicornGraveyard: new ResetReligionBuildingSetting(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      unicornNecropolis: new ResetReligionBuildingSetting(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      unicornPasture: new ResetReligionBuildingSetting(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        true,
        -1
      ),
      unicornTomb: new ResetReligionBuildingSetting(
        "unicornTomb",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
      unicornUtopia: new ResetReligionBuildingSetting(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        false,
        -1
      ),
    }
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: ResetReligionSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.buildings)) {
      this.buildings[name].enabled = item.enabled;
      this.buildings[name].trigger = item.trigger;
    }
  }

  static toLegacyOptions(settings: ResetReligionSettings, subject: LegacyStorage) {
    for (const [name, item] of objectEntries(settings.buildings)) {
      subject.items[`toggle-reset-faith-${name}` as const] = item.enabled;
      subject.items[`set-reset-faith-${name}-min` as const] = item.trigger;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ResetReligionSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-reset-faith-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-faith-${name}-min` as const] ?? item.trigger;
    }

    return options;
  }
}
