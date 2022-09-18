import { cwarn } from "../tools/Log";
import { GamePage, Policy } from "../types";
import { difference, SettingsSection, SettingToggle } from "./SettingsSection";

export type PolicySettingsItem = SettingToggle;
export class PolicySettings extends SettingsSection {
  items: {
    [item in Policy]: PolicySettingsItem;
  } = {
    authocracy: { enabled: false },
    bigStickPolicy: { enabled: false },
    carnivale: { enabled: false },
    cityOnAHill: { enabled: false },
    clearCutting: { enabled: false },
    communism: { enabled: false },
    conservation: { enabled: false },
    culturalExchange: { enabled: false },
    diplomacy: { enabled: false },
    environmentalism: { enabled: false },
    epicurianism: { enabled: false },
    expansionism: { enabled: false },
    extravagance: { enabled: false },
    fascism: { enabled: false },
    frugality: { enabled: false },
    fullIndustrialization: { enabled: false },
    isolationism: { enabled: false },
    knowledgeSharing: { enabled: false },
    liberalism: { enabled: false },
    liberty: { enabled: false },
    militarizeSpace: { enabled: false },
    monarchy: { enabled: false },
    mysticism: { enabled: false },
    necrocracy: { enabled: false },
    openWoodlands: { enabled: false },
    outerSpaceTreaty: { enabled: false },
    radicalXenophobia: { enabled: false },
    rationality: { enabled: false },
    rationing: { enabled: false },
    republic: { enabled: false },
    socialism: { enabled: false },
    stoicism: { enabled: false },
    stripMining: { enabled: false },
    sustainability: { enabled: false },
    technocracy: { enabled: false },
    theocracy: { enabled: false },
    tradition: { enabled: false },
    transkittenism: { enabled: false },
    zebraRelationsAppeasement: { enabled: false },
    zebraRelationsBellicosity: { enabled: false },
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
