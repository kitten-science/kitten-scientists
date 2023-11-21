import { UserScript } from "../UserScript.js";
import { StateLoader } from "./StateLoader.js";
import { StateMerger } from "./StateMerger.js";

export class State {
  readonly originUrl: string;
  readonly parent: State | undefined;
  readonly children = new Array<State>();

  readonly loader: StateLoader;

  get state() {
    return this.loader?.data;
  }

  constructor(originUrl: string, parent?: State) {
    this.originUrl = originUrl;
    this.parent = parent;
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
