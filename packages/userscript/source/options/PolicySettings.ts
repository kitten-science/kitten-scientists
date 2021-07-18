import { Policy } from "../types";
import { SettingsSection } from "./SettingsSection";

export type PolicySettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
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
}
