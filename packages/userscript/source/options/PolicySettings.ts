import { difference } from "../tools/Array";
import { cwarn } from "../tools/Log";
import { GamePage, Policy } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class PolicySettings extends SettingsSection {
  items: {
    [item in Policy]: Setting;
  } = {
    authocracy: new Setting(false),
    bigStickPolicy: new Setting(false),
    carnivale: new Setting(false),
    cityOnAHill: new Setting(false),
    clearCutting: new Setting(false),
    communism: new Setting(false),
    conservation: new Setting(false),
    culturalExchange: new Setting(false),
    diplomacy: new Setting(false),
    environmentalism: new Setting(false),
    epicurianism: new Setting(false),
    expansionism: new Setting(false),
    extravagance: new Setting(false),
    fascism: new Setting(false),
    frugality: new Setting(false),
    fullIndustrialization: new Setting(false),
    isolationism: new Setting(false),
    knowledgeSharing: new Setting(false),
    liberalism: new Setting(false),
    liberty: new Setting(false),
    militarizeSpace: new Setting(false),
    monarchy: new Setting(false),
    mysticism: new Setting(false),
    necrocracy: new Setting(false),
    openWoodlands: new Setting(false),
    outerSpaceTreaty: new Setting(false),
    radicalXenophobia: new Setting(false),
    rationality: new Setting(false),
    rationing: new Setting(false),
    republic: new Setting(false),
    socialism: new Setting(false),
    stoicism: new Setting(false),
    stripMining: new Setting(false),
    sustainability: new Setting(false),
    technocracy: new Setting(false),
    theocracy: new Setting(false),
    tradition: new Setting(false),
    transkittenism: new Setting(false),
    zebraRelationsAppeasement: new Setting(false),
    zebraRelationsBellicosity: new Setting(false),
  };

  static validateGame(game: GamePage, settings: PolicySettings) {
    const inSettings = Object.keys(settings.items);
    const inGame = game.science.policies.map(policy => policy.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const policy of missingInSettings) {
      cwarn(`The policy '${policy}' is not tracked in Kitten Scientists!`);
    }
    for (const policy of redundantInSettings) {
      cwarn(`The policy '${policy}' is not a policy in Kitten Game!`);
    }
  }
}
