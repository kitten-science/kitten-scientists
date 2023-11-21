import { TreeNode, retry } from "@oliversalzburg/js-utils";
import { errorToRecord, unknownToError } from "@oliversalzburg/js-utils/error-serializer.js";
import { Report } from "@oliversalzburg/js-utils/log/report.js";
import { mustExist } from "@oliversalzburg/js-utils/nil.js";
import { State } from "./State.js";

export interface ResolverStateView {
  extends?: Array<string>;
}

export class StateLoader extends TreeNode<StateLoader> {
  readonly cache = new Map<string, StateLoader>();
  readonly report: Report;
  readonly state: State;

  #request: Promise<Response> | undefined;
  #response: Response | undefined;
  #dataParsed: Promise<Record<string, unknown>> | undefined;
  #data: Record<string, unknown> | undefined;

  get data() {
    return this.#data;
  }
  get request() {
    return this.#request;
  }
  get response() {
    return this.#response;
  }

  constructor(state: State) {
    super(state.parent?.loader);

    this.state = state;
    this.report = state.parent
      ? mustExist(state.parent.loader).report.child(new Report(state.originUrl))
      : new Report(state.originUrl);
  }

  async load(cache = this.cache): Promise<Report> {
    const entry = performance.now();

    let data;
    let timeHttp = 0;
    try {
      const cached = cache.get(this.state.originUrl);
      if (cached) {
        this.report.log(`✅ Using existing request from cache.`);
      } else {
        this.report.log("🔍 Resolving document from URL...");
      }

      const start = performance.now();
      const requestExecutor = async () => {
        this.#request = cached?.request ?? fetch(this.state.originUrl);

        if (!cached) {
          cache.set(this.state.originUrl, this);
        }

        this.#response = cached?.response ?? (await this.#request);

        this.#dataParsed =
          cached && cached.#dataParsed ? cached.#dataParsed : this.#response.json();

        return cached?.data ?? (await this.#dataParsed);
      };
      data = await retry(requestExecutor, 300, 3);
      const end = performance.now();

      timeHttp = end - start;
    } catch (error) {
      this.report.log(
        `😑 Error while resolving ${this.state.originUrl}!`,
        errorToRecord(unknownToError(error)),
      );
      return this.report;
    }

    // TODO: Validate again JSON schema.
    this.#data = data;
    const bases = await this.#resolveBases(this.#data, cache);
    if (bases.length === 0) {
      this.report.log("🍁 Profile is a leaf node and should be a baseline!");
    } else {
      this.report.log("🌳 Profile is a tree node.");
    }

    const exit = performance.now();
    const timeSelf = exit - entry - timeHttp;
    this.report.log(
      `😊 Profile resolved successfully. (req:${Math.round(timeHttp)}ms, self:${Math.round(
        timeSelf,
      )}ms)`,
    );
    return this.report;
  }

  async #resolveBases(state: ResolverStateView, cache = this.cache) {
    if (!Array.isArray(state.extends) || state.extends.length === 0) {
      return Promise.resolve([]);
    }

    this.report.log("🧶 Resolving bases...");

    for (const base of state.extends) {
      const baseState = this.state.child(new State(base, this.state));
      this.child(baseState.loader);
    }

    return Promise.all([...this.children.values()].map(loader => loader.load(cache)));
  }
}
