import { difference } from "../tools/Array";
import { objectEntries } from "../tools/Entries";
import { cwarn } from "../tools/Log";
import { GamePage, Technology } from "../types";
import { Setting } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class TechSettings extends Setting {
  items: {
    [item in Technology]: Setting;
  };

  constructor(
    id = "techs",
    enabled = false,
    items = {
      acoustics: new Setting("acoustics", true),
      advExogeology: new Setting("advExogeology", true),
      agriculture: new Setting("agriculture", true),
      ai: new Setting("ai", true),
      animal: new Setting("animal", true),
      antimatter: new Setting("antimatter", true),
      archeology: new Setting("archeology", true),
      archery: new Setting("archery", true),
      architecture: new Setting("architecture", true),
      artificialGravity: new Setting("artificialGravity", true),
      astronomy: new Setting("astronomy", true),
      biochemistry: new Setting("biochemistry", true),
      biology: new Setting("biology", true),
      blackchain: new Setting("blackchain", true),
      brewery: new Setting("brewery", true),
      calendar: new Setting("calendar", true),
      chemistry: new Setting("chemistry", true),
      chronophysics: new Setting("chronophysics", true),
      civil: new Setting("civil", true),
      combustion: new Setting("combustion", true),
      construction: new Setting("construction", true),
      cryptotheology: new Setting("cryptotheology", true),
      currency: new Setting("currency", true),
      dimensionalPhysics: new Setting("dimensionalPhysics", true),
      drama: new Setting("drama", true),
      ecology: new Setting("ecology", true),
      electricity: new Setting("electricity", true),
      electronics: new Setting("electronics", true),
      engineering: new Setting("engineering", true),
      exogeology: new Setting("exogeology", true),
      exogeophysics: new Setting("exogeophysics", true),
      genetics: new Setting("genetics", true),
      hydroponics: new Setting("hydroponics", true),
      industrialization: new Setting("industrialization", true),
      machinery: new Setting("machinery", true),
      math: new Setting("math", true),
      mechanization: new Setting("mechanization", true),
      metal: new Setting("metal", true),
      metalurgy: new Setting("metalurgy", true),
      metaphysics: new Setting("metaphysics", true),
      mining: new Setting("mining", true),
      nanotechnology: new Setting("nanotechnology", true),
      navigation: new Setting("navigation", true),
      nuclearFission: new Setting("nuclearFission", true),
      oilProcessing: new Setting("oilProcessing", true),
      orbitalEngineering: new Setting("orbitalEngineering", true),
      paradoxalKnowledge: new Setting("paradoxalKnowledge", true),
      particlePhysics: new Setting("particlePhysics", true),
      philosophy: new Setting("philosophy", true),
      physics: new Setting("physics", true),
      quantumCryptography: new Setting("quantumCryptography", true),
      robotics: new Setting("robotics", true),
      rocketry: new Setting("rocketry", true),
      sattelites: new Setting("sattelites", true),
      steel: new Setting("steel", true),
      superconductors: new Setting("superconductors", true),
      tachyonTheory: new Setting("tachyonTheory", true),
      terraformation: new Setting("terraformation", true),
      theology: new Setting("theology", true),
      thorium: new Setting("thorium", true),
      voidSpace: new Setting("voidSpace", true),
      writing: new Setting("writing", true),
    }
  ) {
    super(id, enabled);
    this.items = items;
  }

  static validateGame(game: GamePage, settings: TechSettings) {
    const inSettings = Object.keys(settings.items);
    const inGame = game.science.techs.map(tech => tech.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const tech of missingInSettings) {
      cwarn(`The technology '${tech}' is not tracked in Kitten Scientists!`);
    }
    for (const tech of redundantInSettings) {
      cwarn(`The technology '${tech}' is not a technology in Kitten Game!`);
    }
  }

  load(settings: TechSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: TechSettings, subject: KittenStorageType) {
    subject.items["toggle-techs"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-tech-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TechSettings();
    options.enabled = subject.items["toggle-policies"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-tech-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
