import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Game, type Policy } from "../types/index.js";
import { Setting } from "./Settings.js";
export declare class PolicySetting extends Setting {
  #private;
  get policy():
    | "authocracy"
    | "bigStickPolicy"
    | "carnivale"
    | "cityOnAHill"
    | "clearCutting"
    | "communism"
    | "conservation"
    | "cryochamberExtraction"
    | "culturalExchange"
    | "diplomacy"
    | "dragonRelationsAstrologers"
    | "dragonRelationsDynamicists"
    | "dragonRelationsPhysicists"
    | "environmentalism"
    | "epicurianism"
    | "expansionism"
    | "extravagance"
    | "fascism"
    | "frugality"
    | "fullIndustrialization"
    | "griffinRelationsMachinists"
    | "griffinRelationsMetallurgists"
    | "griffinRelationsScouts"
    | "isolationism"
    | "knowledgeSharing"
    | "liberalism"
    | "liberty"
    | "lizardRelationsDiplomats"
    | "lizardRelationsEcologists"
    | "lizardRelationsPriests"
    | "militarizeSpace"
    | "monarchy"
    | "mysticism"
    | "nagaRelationsArchitects"
    | "nagaRelationsCultists"
    | "nagaRelationsMasons"
    | "necrocracy"
    | "openWoodlands"
    | "outerSpaceTreaty"
    | "radicalXenophobia"
    | "rationality"
    | "rationing"
    | "republic"
    | "scientificCommunism"
    | "sharkRelationsBotanists"
    | "sharkRelationsMerchants"
    | "sharkRelationsScribes"
    | "siphoning"
    | "socialism"
    | "spiderRelationsChemists"
    | "spiderRelationsGeologists"
    | "spiderRelationsPaleontologists"
    | "stoicism"
    | "stripMining"
    | "sustainability"
    | "technocracy"
    | "terraformingInsight"
    | "theocracy"
    | "tradition"
    | "transkittenism"
    | "zebraRelationsAppeasement"
    | "zebraRelationsBellicosity";
  constructor(policy: Policy, enabled?: boolean);
}
export type PolicyPolicySettings = Record<Policy, PolicySetting>;
export declare class PolicySettings extends Setting {
  policies: PolicyPolicySettings;
  constructor(enabled?: boolean);
  private initPolicies;
  static validateGame(game: Game, settings: PolicySettings): void;
  load(settings: Maybe<Partial<PolicySettings>>): void;
}
//# sourceMappingURL=PolicySettings.d.ts.map
