import { SavegameLoader } from "@kitten-science/kitten-scientists/tools/SavegameLoader.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { I18nEngine } from "@kitten-science/kitten-scientists/types/index.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KGNetSavePersisted } from "./entrypoint-backend.js";
import { cdebug, cinfo, cwarn } from "./tools/Log.js";
import { identifyExchange } from "./tools/MessageFormat.js";

declare global {
  interface Window {
    kittenAnalysts?: KittenAnalysts;
  }
}

export type KittenAnalystsMessageId =
  | "connected"
  | "getBuildings"
  | "getResourcePool"
  | "getStatistics"
  | "injectSavegame"
  | "reportFrame"
  | "reportSavegame";

export type PayloadBuildings = Array<{
  label: string;
  name: string;
  on: number;
  tab: string;
  value: number;
}>;
export type PayloadResources = Array<{
  craftable: boolean;
  label: string;
  maxValue: number;
  name: string;
  value: number;
}>;
export type PayloadStatistics = Array<{
  label: string;
  name: string;
  type: "all_time" | "current";
  value: number;
}>;

export interface KittenAnalystsMessage<
  TMessage extends KittenAnalystsMessageId,
  TData = TMessage extends "getBuildings"
    ? PayloadBuildings
    : TMessage extends "getResourcePool"
      ? PayloadResources
      : TMessage extends "getStatistics"
        ? PayloadStatistics
        : TMessage extends "reportFrame"
          ? unknown
          : TMessage extends "reportSavegame"
            ? unknown
            : TMessage extends "injectSavegame"
              ? KGNetSavePersisted
              : never,
> {
  /**
   * The payload of the message.
   */
  data?: TData;

  /**
   * The HTTP URL that identifies the context of the client that sent the message.
   */
  location?: string;

  /**
   * If the message requires a response, it should declare a `responseId`, which the receiver
   * will also put on the response.
   */
  responseId?: string;

  /**
   * The type identifier for the message.
   */
  type: TMessage;
}

export class KittenAnalysts {
  /**
   * A reference to the Kittens Game.
   */
  readonly game: Game;

  /**
   * Should the Kitten Analysts report information to the Kitten DnA backend?
   * Because this only makes sense in a strict development environment, this
   * should usually be kept disabled for most users.
   */
  reportToBackend = false;

  /**
   * The websocket we're using to talk to the backend.
   */
  ws: WebSocket | null = null;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;

  readonly location = window.location.toString().replace(/#$/, "");

  #interval = -1;
  #timeoutReconnect = -1;

  constructor(game: Game, i18nEngine: I18nEngine) {
    cinfo(`Kitten Analysts constructed.`);

    this.game = game;
    this.i18nEngine = i18nEngine;

    // Assume Kitten Science DNA context if we're on localhost with the default port of KSA.
    if (this.location.startsWith("http://localhost:9080")) {
      this.reportToBackend = true;
    }
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run() {
    this.connect();
  }

  connect() {
    if (this.ws !== null) {
      return;
    }

    if (-1 < this.#timeoutReconnect) {
      window.clearTimeout(this.#timeoutReconnect);
      this.#timeoutReconnect = -1;
    }

    document.removeEventListener("ks.reportFrame", this.reportFrameListener);
    document.addEventListener("ks.reportFrame", this.reportFrameListener);

    document.removeEventListener("ks.reportSavegame", this.reportSavegameListener);
    document.addEventListener("ks.reportSavegame", this.reportSavegameListener);

    if (!this.reportToBackend) {
      return;
    }

    this.ws = new WebSocket("ws://localhost:9093/");

    this.ws.onerror = error => {
      cwarn("Error on WS connection! Closing and reconnecting...", error);
      // This should also trigger the `onclose` handler below and, thus, the reconnect.
      this.ws?.close();
      this.ws = null;
    };

    this.ws.onclose = () => {
      cwarn("WS connection closed! Reconnecting...");
      this.ws?.close();
      this.ws = null;
      this.reconnect();
    };

    this.ws.onopen = () => {
      cinfo("WS connection established.");
      this.postMessage({ type: "connected", location: this.location });
    };

    this.ws.onmessage = event => {
      const message = JSON.parse(
        event.data as string,
      ) as KittenAnalystsMessage<KittenAnalystsMessageId>;
      const response = this.processMessage(message);
      if (!response) {
        return;
      }
      this.postMessage(response);
    };
  }

  processMessage(
    message: KittenAnalystsMessage<KittenAnalystsMessageId>,
  ): KittenAnalystsMessage<KittenAnalystsMessageId> | undefined {
    cdebug(`=> ${identifyExchange(message)} received.`);

    switch (message.type) {
      case "connected":
        break;
      case "getBuildings": {
        const bonfire: PayloadBuildings = game.bld.meta[0].meta.flatMap(building => {
          if (building.stages) {
            return building.stages.map((stage, index) => ({
              name: building.name,
              value: index === building.stage ? building.val : 0,
              on: index === building.stage ? building.on : 0,
              label: stage.label,
              tab: "bonfire",
            }));
          }
          return {
            name: building.name,
            value: building.val,
            on: building.on,
            label: building.label ?? building.name,
            tab: "bonfire",
          };
        });
        const space: PayloadBuildings = game.space.meta.flatMap((meta, index) =>
          // index 0 is moon missions
          index === 0
            ? []
            : meta.meta.map(building => ({
                name: building.name,
                value: building.val,
                on: building.on,
                label: building.label,
                tab: "space",
              })),
        );
        const religion: PayloadBuildings = game.religion.meta.flatMap(meta =>
          meta.meta.map(building => ({
            name: building.name,
            value: building.val,
            on: 0,
            label: building.label,
            tab: "religion",
          })),
        );

        return {
          type: message.type,
          location: this.location,
          responseId: message.responseId,
          data: [...bonfire, ...space, ...religion],
        };

        break;
      }
      case "getResourcePool": {
        const data: PayloadResources = game.resPool.resources.map(resource => ({
          name: resource.name,
          value: resource.value,
          maxValue: resource.maxValue,
          label: resource.title,
          craftable: resource.craftable ?? false,
        }));

        return {
          type: message.type,
          location: this.location,
          responseId: message.responseId,
          data,
        };

        break;
      }
      case "getStatistics": {
        const data: PayloadStatistics = game.stats.statGroups.flatMap((group, index) =>
          group.group.map(member => ({
            name: member.name,
            label: member.title,
            type: index === 0 ? "all_time" : "current",
            value: member.val,
          })),
        );

        return {
          type: message.type,
          location: this.location,
          responseId: message.responseId,
          data,
        };

        break;
      }
      case "injectSavegame": {
        cwarn("=> Injecting savegame...");
        const data = message.data as KGNetSavePersisted;
        new SavegameLoader(this.game)
          .load(data.saveData as string)
          .catch(redirectErrorsToConsole(console));
        break;
      }
    }

    return undefined;
  }

  reportFrameListener = (event: Event): void => {
    const location = window.location.toString().replace(/#$/, "");
    this.postMessage({
      type: "reportFrame",
      location,
      data: (event as CustomEvent<unknown>).detail,
    });
  };

  reportSavegameListener = (event: Event): void => {
    const location = window.location.toString().replace(/#$/, "");
    this.postMessage({
      type: "reportSavegame",
      location,
      data: (event as CustomEvent<unknown>).detail,
    });
  };

  heartbeat() {
    cdebug("Heartbeat");
    window.clearTimeout(this.#timeoutReconnect);
    this.#timeoutReconnect = window.setTimeout(() => this.ws?.close(), 30000);
  }

  reconnect() {
    if (-1 < this.#timeoutReconnect) {
      return;
    }

    cinfo("Reconnecting...");

    this.#timeoutReconnect = window.setTimeout(() => {
      this.connect();
    }, 5000);
  }

  postMessage<TMessage extends KittenAnalystsMessageId>(message: KittenAnalystsMessage<TMessage>) {
    if (this.ws === null) {
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      if ("responseId" in message) {
        cdebug(`<= ${identifyExchange(message)} fulfilled.`);
      } else {
        cdebug(`<= ${identifyExchange(message)} dispatched.`);
      }
    } catch (error) {
      cwarn("Error while sending message. Closing socket.", error);
      this.ws.onclose?.(new CloseEvent("close"));
    }
  }

  start() {
    if (this.#interval !== -1) {
      return;
    }
  }
  stop() {
    window.clearInterval(this.#interval);
    this.#interval = -1;
  }

  snapshot() {}
}
