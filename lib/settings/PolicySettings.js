import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Policies } from "../types/index.js";
import { Setting } from "./Settings.js";
export class PolicySetting extends Setting {
  #policy;
  get policy() {
    return this.#policy;
  }
  constructor(policy, enabled = false) {
    super(enabled);
    this.#policy = policy;
  }
}
export class PolicySettings extends Setting {
  policies;
  constructor(enabled = false) {
    super(enabled);
    this.policies = this.initPolicies();
  }
  initPolicies() {
    const items = {};
    for (const item of Policies) {
      items[item] = new PolicySetting(item);
    }
    return items;
  }
  static validateGame(game, settings) {
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
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.policies, settings.policies, (policy, item) => {
      policy.enabled = item?.enabled ?? policy.enabled;
    });
  }
}
//# sourceMappingURL=PolicySettings.js.map
