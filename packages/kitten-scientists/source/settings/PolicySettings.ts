import { difference } from "@oliversalzburg/js-utils/lib/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/lib/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, Policy } from "../types/index.js";
import { Setting } from "./Settings.js";

export class PolicySetting extends Setting {
  readonly #policy: Policy;

  get policy() {
    return this.#policy;
  }

  constructor(policy: Policy, enabled = false) {
    super(enabled);
    this.#policy = policy;
  }
}

export type PolicyPolicySettings = Record<Policy, PolicySetting>;

export class PolicySettings extends Setting {
  policies: PolicyPolicySettings;

  constructor(
    enabled = false,
    policies: PolicyPolicySettings = {
      authocracy: new PolicySetting("authocracy", false),
      bigStickPolicy: new PolicySetting("bigStickPolicy", false),
      carnivale: new PolicySetting("carnivale", false),
      cityOnAHill: new PolicySetting("cityOnAHill", false),
      clearCutting: new PolicySetting("clearCutting", false),
      communism: new PolicySetting("communism", false),
      conservation: new PolicySetting("conservation", false),
      culturalExchange: new PolicySetting("culturalExchange", false),
      diplomacy: new PolicySetting("diplomacy", false),
      environmentalism: new PolicySetting("environmentalism", false),
      epicurianism: new PolicySetting("epicurianism", false),
      expansionism: new PolicySetting("expansionism", false),
      extravagance: new PolicySetting("extravagance", false),
      fascism: new PolicySetting("fascism", false),
      frugality: new PolicySetting("frugality", false),
      fullIndustrialization: new PolicySetting("fullIndustrialization", false),
      isolationism: new PolicySetting("isolationism", false),
      knowledgeSharing: new PolicySetting("knowledgeSharing", false),
      liberalism: new PolicySetting("liberalism", false),
      liberty: new PolicySetting("liberty", false),
      militarizeSpace: new PolicySetting("militarizeSpace", false),
      monarchy: new PolicySetting("monarchy", false),
      mysticism: new PolicySetting("mysticism", false),
      necrocracy: new PolicySetting("necrocracy", false),
      openWoodlands: new PolicySetting("openWoodlands", false),
      outerSpaceTreaty: new PolicySetting("outerSpaceTreaty", false),
      radicalXenophobia: new PolicySetting("radicalXenophobia", false),
      rationality: new PolicySetting("rationality", false),
      rationing: new PolicySetting("rationing", false),
      republic: new PolicySetting("republic", false),
      socialism: new PolicySetting("socialism", false),
      stoicism: new PolicySetting("stoicism", false),
      stripMining: new PolicySetting("stripMining", false),
      sustainability: new PolicySetting("sustainability", false),
      technocracy: new PolicySetting("technocracy", false),
      theocracy: new PolicySetting("theocracy", false),
      tradition: new PolicySetting("tradition", false),
      transkittenism: new PolicySetting("transkittenism", false),
      zebraRelationsAppeasement: new PolicySetting("zebraRelationsAppeasement", false),
      zebraRelationsBellicosity: new PolicySetting("zebraRelationsBellicosity", false),
    },
  ) {
    super(enabled);
    this.policies = policies;
  }

  static validateGame(game: Game, settings: PolicySettings) {
    const inSettings = Object.keys(settings.policies);
    const inGame = game.science.policies.map(policy => policy.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const policy of missingInSettings) {
      cwarn(`The policy '${policy}' is not tracked in Kitten Scientists!`);
    }
    for (const policy of redundantInSettings) {
      cwarn(`The policy '${policy}' is not a policy in Kittens Game!`);
    }
  }

  load(settings: Maybe<Partial<PolicySettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.policies, settings.policies, (policy, item) => {
      policy.enabled = item?.enabled ?? policy.enabled;
    });
  }
}
