import { TreeNode } from "@oliversalzburg/js-utils";
import { UserScript } from "../UserScript.js";
import { StateLoader } from "./StateLoader.js";
import { StateMerger } from "./StateMerger.js";

export class State extends TreeNode<State> {
  readonly originUrl: string;

  readonly loader: StateLoader;

  get state() {
    return this.loader?.data;
  }

  constructor(originUrl: string, parent?: State) {
    super(parent);
    this.originUrl = originUrl;
    this.loader = new StateLoader(this);
  }

  async resolve() {
    const report = await this.loader.load();
    return { loader: this.loader, report };
  }

  merge() {
    return new StateMerger(this).merge(UserScript.unknownAsEngineStateOrThrow({ v: "2.0.0" }));
  }
}
