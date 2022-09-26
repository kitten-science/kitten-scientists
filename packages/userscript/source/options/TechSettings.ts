import { difference } from "../tools/Array";
import { cwarn } from "../tools/Log";
import { GamePage, Technology } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class TechSettings extends SettingsSection {
  items: {
    [item in Technology]: Setting;
  } = {
    acoustics: new Setting(true),
    advExogeology: new Setting(true),
    agriculture: new Setting(true),
    ai: new Setting(true),
    animal: new Setting(true),
    antimatter: new Setting(true),
    archeology: new Setting(true),
    archery: new Setting(true),
    architecture: new Setting(true),
    artificialGravity: new Setting(true),
    astronomy: new Setting(true),
    biochemistry: new Setting(true),
    biology: new Setting(true),
    blackchain: new Setting(true),
    brewery: new Setting(true),
    calendar: new Setting(true),
    chemistry: new Setting(true),
    chronophysics: new Setting(true),
    civil: new Setting(true),
    combustion: new Setting(true),
    construction: new Setting(true),
    cryptotheology: new Setting(true),
    currency: new Setting(true),
    dimensionalPhysics: new Setting(true),
    drama: new Setting(true),
    ecology: new Setting(true),
    electricity: new Setting(true),
    electronics: new Setting(true),
    engineering: new Setting(true),
    exogeology: new Setting(true),
    exogeophysics: new Setting(true),
    genetics: new Setting(true),
    hydroponics: new Setting(true),
    industrialization: new Setting(true),
    machinery: new Setting(true),
    math: new Setting(true),
    mechanization: new Setting(true),
    metal: new Setting(true),
    metalurgy: new Setting(true),
    metaphysics: new Setting(true),
    mining: new Setting(true),
    nanotechnology: new Setting(true),
    navigation: new Setting(true),
    nuclearFission: new Setting(true),
    oilProcessing: new Setting(true),
    orbitalEngineering: new Setting(true),
    paradoxalKnowledge: new Setting(true),
    particlePhysics: new Setting(true),
    philosophy: new Setting(true),
    physics: new Setting(true),
    quantumCryptography: new Setting(true),
    robotics: new Setting(true),
    rocketry: new Setting(true),
    sattelites: new Setting(true),
    steel: new Setting(true),
    superconductors: new Setting(true),
    tachyonTheory: new Setting(true),
    terraformation: new Setting(true),
    theology: new Setting(true),
    thorium: new Setting(true),
    voidSpace: new Setting(true),
    writing: new Setting(true),
  };

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
}
