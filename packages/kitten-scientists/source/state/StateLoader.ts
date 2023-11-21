import { retry } from "@oliversalzburg/js-utils";
import { errorToRecord, unknownToError } from "@oliversalzburg/js-utils/error-serializer.js";
import { mustExist } from "@oliversalzburg/js-utils/nil.js";
import { State } from "./State.js";

export interface ResolverStateView {
  extends?: Array<string>;
}
export interface ReportEntry {
  message: string;
  context: Record<string, unknown> | undefined;
}

const indent = (text: string, depth = 0) => text.replaceAll(/^/gm, "    ".repeat(depth));

export class LoaderReport {
  readonly origin: string;
  #store = new Map<string, Array<ReportEntry>>();
  #parent: LoaderReport | undefined;
  readonly children = new Array<LoaderReport>();

  constructor(origin: string) {
    this.origin = origin;
  }

  #getStoreEntry(entry: string) {
    if (!this.#store.has(entry)) {
      this.#store.set(entry, new Array<ReportEntry>());
    }
    return this.#store.get(entry);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.#getStoreEntry(this.origin)?.push({ message, context });
  }
  request(message: string, context?: Record<string, unknown>) {
    this.#getStoreEntry(this.origin)?.push({ message, context });
  }
  failure(message: string, context?: Record<string, unknown>) {
    this.#getStoreEntry(this.origin)?.push({ message, context });
  }
  success(message: string, context?: Record<string, unknown>) {
    this.#getStoreEntry(this.origin)?.push({ message, context });
  }

  aggregateLog(depth = 0) {
    for (const [profileId, records] of this.#store.entries()) {
      console.log(indent(`PROFILE: ${profileId}`, depth));
      for (const entry of records) {
        console.log(indent(` - ${entry.message}`, depth));
        if (entry.context) {
          console.log(indent(JSON.stringify(entry.context, undefined, depth + 4), depth));
        }
      }
    }

    if (this.children.length === 0) {
      return;
    }

    console.log(indent(` > Child loader reports:`, depth));
    for (const child of this.children) {
      child.aggregateLog(depth + 1);
    }
  }

  child(childOrigin: string) {
    const childReport = new LoaderReport(childOrigin);
    childReport.#parent = this;
    this.children.push(childReport);
    return childReport;
  }
}

export class StateLoader {
  readonly cache = new Map<string, StateLoader>();
  readonly report: LoaderReport;
  readonly state: State;

  #children = new Array<StateLoader>();
  #parent: State | undefined;

  #request: Promise<Response> | undefined;
  #response: Response | undefined;
  #dataParsed: Promise<Record<string, unknown>> | undefined;
  #data: Record<string, unknown> | undefined;

  get children() {
    return this.#children;
  }
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
    this.state = state;
    this.#parent = state.parent?.loader?.state;
    this.report = state.parent
      ? mustExist(state.parent.loader).report.child(state.originUrl)
      : new LoaderReport(state.originUrl);
  }

  async load(cache = this.cache): Promise<LoaderReport> {
    const entry = performance.now();

    let data;
    let timeHttp = 0;
    try {
      const cached = cache.get(this.state.originUrl);
      if (cached) {
        this.report.success(`✅ Using existing request from cache.`);
      } else {
        this.report.request("🔍 Resolving document from URL...");
      }

      const start = performance.now();
      const requestExecutor = async () => {
        const request = cached?.request ?? fetch(this.state.originUrl);
        this.#request = request;

        if (!cached) {
          cache.set(this.state.originUrl, this);
        }

        this.#response = cached?.response ?? (await request);

        this.#dataParsed =
          cached && cached.#dataParsed ? cached.#dataParsed : this.#response.json();

        return cached?.data ?? (await this.#dataParsed);
      };
      data = await retry(requestExecutor, 300, 3);
      const end = performance.now();

      timeHttp = end - start;
    } catch (error) {
      this.report.failure(
        `😑 Error while resolving ${this.state.originUrl}!`,
        errorToRecord(unknownToError(error)),
      );
      return this.report;
    }

    // TODO: Validate again JSON schema.
    this.#data = data;
    const bases = await this.#resolveBases(this.#data, cache);
    if (bases.length === 0) {
      this.report.info("🍁 Profile is a leaf node and should be a baseline!");
    } else {
      this.report.info("🌳 Profile is a tree node.");
    }

    const exit = performance.now();
    const timeSelf = exit - entry - timeHttp;
    this.report.success(
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

    this.report.request("🧶 Resolving bases...");

    for (const base of state.extends) {
      const baseState = new State(base, this.state);
      this.state.children.push(baseState);
      this.#children.push(baseState.loader);
    }

    return Promise.all(this.#children.map(loader => loader.load(cache)));
  }
}
