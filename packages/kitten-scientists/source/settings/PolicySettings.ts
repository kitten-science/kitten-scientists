import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, Policies, Policy } from "../types/index.js";
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

  constructor(enabled = false) {
    super(enabled);
    this.policies = this.initPolicies();
  }

  private initPolicies(): PolicyPolicySettings {
    const items = {} as PolicyPolicySettings;
    Policies.forEach(item => {
      items[item] = new PolicySetting(item);
    });
    return items;
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
