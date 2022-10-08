import { difference } from "../tools/Array";
import { cwarn } from "../tools/Log";
import { GamePage, Policy } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class PolicySettings extends SettingsSection {
  items: {
    [item in Policy]: Setting;
  } = {
    authocracy: new Setting("authocracy", false),
    bigStickPolicy: new Setting("bigStickPolicy", false),
    carnivale: new Setting("carnivale", false),
    cityOnAHill: new Setting("cityOnAHill", false),
    clearCutting: new Setting("clearCutting", false),
    communism: new Setting("communism", false),
    conservation: new Setting("conservation", false),
    culturalExchange: new Setting("culturalExchange", false),
    diplomacy: new Setting("diplomacy", false),
    environmentalism: new Setting("environmentalism", false),
    epicurianism: new Setting("epicurianism", false),
    expansionism: new Setting("expansionism", false),
    extravagance: new Setting("extravagance", false),
    fascism: new Setting("fascism", false),
    frugality: new Setting("frugality", false),
    fullIndustrialization: new Setting("fullIndustrialization", false),
    isolationism: new Setting("isolationism", false),
    knowledgeSharing: new Setting("knowledgeSharing", false),
    liberalism: new Setting("liberalism", false),
    liberty: new Setting("liberty", false),
    militarizeSpace: new Setting("militarizeSpace", false),
    monarchy: new Setting("monarchy", false),
    mysticism: new Setting("mysticism", false),
    necrocracy: new Setting("necrocracy", false),
    openWoodlands: new Setting("openWoodlands", false),
    outerSpaceTreaty: new Setting("outerSpaceTreaty", false),
    radicalXenophobia: new Setting("radicalXenophobia", false),
    rationality: new Setting("rationality", false),
    rationing: new Setting("rationing", false),
    republic: new Setting("republic", false),
    socialism: new Setting("socialism", false),
    stoicism: new Setting("stoicism", false),
    stripMining: new Setting("stripMining", false),
    sustainability: new Setting("sustainability", false),
    technocracy: new Setting("technocracy", false),
    theocracy: new Setting("theocracy", false),
    tradition: new Setting("tradition", false),
    transkittenism: new Setting("transkittenism", false),
    zebraRelationsAppeasement: new Setting("zebraRelationsAppeasement", false),
    zebraRelationsBellicosity: new Setting("zebraRelationsBellicosity", false),
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
