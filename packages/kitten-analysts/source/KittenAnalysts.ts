import { cinfo, Game, I18nEngine } from "@kitten-science/kitten-scientists";

export type KittenAnalystsMessageId =
  | "connected"
  | "getBuildings"
  | "getResourcePool"
  | "getStatistics"
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
            : never,
> {
  responseId?: string;
  location?: string;
  type: TMessage;
  data?: TData;
}

export class KittenAnalysts {
  readonly game: Game;
  ws: WebSocket | null = null;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;
  #interval = -1;
  #timeoutReconnect = -1;

  constructor(game: Game, i18nEngine: I18nEngine) {
    cinfo(`Kitten Analysts constructed.`);

    this.game = game;
    this.i18nEngine = i18nEngine;
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run() {
    console.warn("KSA-UI: !!! KITTEN ANALYSTS ARE INSPECTING YOUR WORKPLACES !!!");

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

    this.ws = new WebSocket("ws://localhost:9093/");
    const location = window.location.toString().replace(/#$/, "");

    this.ws.onerror = error => {
      console.error(error);
    };

    this.ws.onopen = () => {
      console.info("KSA-UI: WS connection established.");

      this.postMessage({ type: "connected" });

      document.addEventListener("ks.reportFrame", (event: Event) => {
        this.postMessage({
          type: "reportFrame",
          location,
          data: (event as CustomEvent<unknown>).detail,
        });
      });
      document.addEventListener("ks.reportSavegame", (event: Event) => {
        this.postMessage({
          type: "reportSavegame",
          location,
          data: (event as CustomEvent<unknown>).detail,
        });
      });
    };

    this.ws.onclose = () => {
      console.warn("KSA-UI: WS connection closed!");
      this.ws?.close();
      this.ws = null;
      this.reconnect();
    };

    this.ws.onmessage = event => {
      const message = JSON.parse(
        event.data as string,
      ) as KittenAnalystsMessage<KittenAnalystsMessageId>;

      console.debug(`KSA-UI: => Request ID '${message.responseId}' received...`);

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

          this.postMessage({
            type: message.type,
            location,
            responseId: message.responseId,
            data: [...bonfire, ...space],
          });

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

          this.postMessage({
            type: message.type,
            location,
            responseId: message.responseId,
            data,
          });

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

          this.postMessage({
            type: message.type,
            location,
            responseId: message.responseId,
            data,
          });
        }
      }
    };
  }

  heartbeat() {
    console.debug("KSA-UI: Heartbeat");
    window.clearTimeout(this.#timeoutReconnect);
    this.#timeoutReconnect = window.setTimeout(() => this.ws?.close(), 30000);
  }

  reconnect() {
    if (-1 < this.#timeoutReconnect) {
      return;
    }

    console.info("KSA-UI: Reconnecting...");

    this.#timeoutReconnect = window.setTimeout(() => {
      this.connect();
    }, 5000);
  }

  postMessage<TMessage extends KittenAnalystsMessageId>(message: KittenAnalystsMessage<TMessage>) {
    try {
      this.ws?.send(JSON.stringify(message));
      if ("responseId" in message) {
        console.info(`KSA-UI: <= Request ID '${message.responseId}' replied.`);
      } else {
        console.info(`KSA-UI: <= Request type '${message.type}' sent.`);
      }
    } catch (error) {
      console.warn("KSA-UI: Error while sending message. Closing socket.", error);
      this.ws?.onclose?.(new CloseEvent("close"));
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
