import { FrameContext } from "@kitten-science/kitten-scientists/Engine.js";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import { sleep } from "@oliversalzburg/js-utils/async/async.js";
import { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import Koa from "koa";
import Router from "koa-router";
import { writeFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { AddressInfo } from "node:net";
import { join } from "node:path";
import { exponentialBuckets, Histogram, linearBuckets, Registry } from "prom-client";
import { v4 as uuid } from "uuid";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { LOCAL_STORAGE_PATH } from "./globals.js";
import {
  KittenAnalystsMessage,
  KittenAnalystsMessageId,
  PayloadBuildings,
  PayloadResources,
  PayloadStatistics,
} from "./KittenAnalysts.js";
import { kg_building_on } from "./metrics/kg_building_on.js";
import { kg_building_value } from "./metrics/kg_building_value.js";
import { kg_buildings_constructed } from "./metrics/kg_buildings_constructed.js";
import { kg_challenges_completed_total } from "./metrics/kg_challenges_completed_total.js";
import { kg_clicks_total } from "./metrics/kg_clicks_total.js";
import { kg_crafts_total } from "./metrics/kg_crafts_total.js";
import { kg_events_observed } from "./metrics/kg_events_observed.js";
import { kg_kittens_average } from "./metrics/kg_kittens_average.js";
import { kg_kittens_dead } from "./metrics/kg_kittens_dead.js";
import { kg_kittens_total } from "./metrics/kg_kittens_total.js";
import { kg_paragon_total } from "./metrics/kg_paragon_total.js";
import { kg_resets_total } from "./metrics/kg_resets_total.js";
import { kg_resource_max_value } from "./metrics/kg_resource_max_value.js";
import { kg_resource_value } from "./metrics/kg_resource_value.js";
import { kg_trades_total } from "./metrics/kg_trades_total.js";
import { kg_transcendence_tier } from "./metrics/kg_transcendence_tier.js";
import { kg_unicorns_sacrificed } from "./metrics/kg_unicorns_sacrificed.js";
import { kg_years_total } from "./metrics/kg_years_total.js";
import { cwarn } from "./tools/Log.js";
import { identifyExchange } from "./tools/MessageFormat.js";

const ks_iterate_duration = new Histogram({
  name: "ks_iterate_duration",
  help: "How long each iteration of KS took.",
  buckets: [...linearBuckets(0, 1, 100), ...exponentialBuckets(100, 1.125, 30)],
  labelNames: ["location", "manager"],
});

// KGNet Savegame Storage

interface KGNetSaveFromGame {
  guid: string;
  metadata: {
    calendar: {
      day: number;
      year: number;
    };
  };
  saveData: unknown;
}
interface KGNetSaveFromAnalysts {
  telemetry: {
    guid: string;
  };
  calendar: {
    day: number;
    year: number;
  };
}
export interface KGNetSavePersisted {
  archived: boolean;
  guid: string;
  index: {
    calendar: {
      day: number;
      year: number;
    };
  };
  label: string;
  timestamp: number;
  saveData: unknown;
  size: number;
}
const saveStore = new Map<string, KGNetSavePersisted>();
saveStore.set("ks-internal-savestate", {
  guid: "ks-internal-savestate",
  archived: false,
  label: "Ephemeral Background Game",
  index: {
    calendar: {
      day: 0,
      year: 0,
    },
  },
  timestamp: 0,
  saveData: {},
  size: 0,
});

// Websocket stuff

interface RemoteConnection {
  ws: WebSocket;
  isAlive: boolean;
}
export class KittensGameRemote {
  wss: WebSocketServer;
  sockets = new Set<RemoteConnection>();
  #lastKnownHeadlessSocket: RemoteConnection | null = null;

  pendingRequests = new Map<string, { resolve: AnyFunction; reject: AnyFunction }>();

  constructor(port = 9093) {
    this.wss = new WebSocketServer({ port });

    this.wss.on("listening", () => {
      process.stderr.write(`KSA-BE: WS server listening on port ${port}...\n`);
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const host = this;
    this.wss.on("connection", ws => {
      ws.on("error", console.error);

      const socket = { ws, isAlive: true };
      this.sockets.add(socket);
      ws.on("pong", () => {
        socket.isAlive = true;
      });

      ws.on("message", function (data) {
        host.handleMessage(this, data);
      });

      void this.sendMessage({ type: "connected" });
    });

    const interval = setInterval(() => {
      [...this.sockets.values()].forEach(socket => {
        if (!socket.isAlive) {
          socket.ws.terminate();
          this.sockets.delete(socket);
          return;
        }

        socket.isAlive = false;
        socket.ws.ping();
      });
    }, 30000);

    this.wss.on("close", () => {
      clearInterval(interval);
    });
  }

  handleMessage(socket: WebSocket, data: RawData) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const message = JSON.parse(data.toString()) as KittenAnalystsMessage<KittenAnalystsMessageId>;

    if (message.location?.includes("headless.html")) {
      this.#lastKnownHeadlessSocket = { isAlive: true, ws: socket };
    }

    if (!message.responseId) {
      switch (message.type) {
        case "reportFrame": {
          const payload = message.data as FrameContext;
          const delta = payload.exit - payload.entry;
          console.info(`KSA-BE: => Received frame report (${message.location}).`, delta);

          ks_iterate_duration.observe({ location: message.location, manager: "all" }, delta);
          for (const [measurement, timeTaken] of Object.entries(payload.measurements)) {
            if (isNil(timeTaken)) {
              continue;
            }

            ks_iterate_duration.observe(
              { location: message.location, manager: measurement },
              timeTaken,
            );
          }

          return;
        }
        case "reportSavegame": {
          const payload = message.data as KGNetSaveFromAnalysts;
          console.info(`KSA-BE: => Received savegame (${message.location}).`);

          const calendar = payload.calendar;
          const savegame: KGNetSavePersisted = {
            archived: false,
            guid: "ks-internal-savestate",
            index: { calendar: { day: calendar.day, year: calendar.year } },
            label: "Ephemeral Background Game",
            saveData: payload,
            size: JSON.stringify(payload).length,
            timestamp: Date.now(),
          };

          // For the headless session, write the savegame to the ephemeral state.
          // Otherwise, ignore the report. We expect UI session to report through KGNet.
          if (message.location?.includes("headless.html")) {
            saveStore.set("ks-internal-savestate", savegame);
            try {
              writeFileSync(
                `${LOCAL_STORAGE_PATH}/ks-internal-savestate.json`,
                JSON.stringify(savegame),
              );
              console.debug(`KSA-BE: => Savegame persisted to disc.`);
            } catch (error) {
              console.error("KSA-BE: !> Error while persisting savegame to disc!", error);
            }
          }

          return;
        }
        default:
          console.warn(
            `KSA-BE: !> Report with type '${message.type}' is unexpected! Message ignored.`,
          );
          return;
      }
    }

    if (!this.pendingRequests.has(message.responseId)) {
      console.warn(
        `KSA-BE: !> Response ID '${message.responseId}' is unexpected! Message ignored.`,
      );
      return;
    }

    const pendingRequest = this.pendingRequests.get(message.responseId);
    this.pendingRequests.delete(message.responseId);

    pendingRequest?.resolve(message);
    console.debug(`KSA-BE: => Request ID '${message.responseId}' was resolved.`);
  }

  sendMessage<TMessage extends KittenAnalystsMessageId>(
    message: KittenAnalystsMessage<TMessage>,
  ): Promise<Array<KittenAnalystsMessage<TMessage> | null>> {
    const clientRequests = [...this.sockets.values()].map(socket =>
      this.#sendMessageToSocket(
        {
          ...message,
          location: `ws://${(this.wss.address() as AddressInfo | null)?.address ?? "localhost"}:9093/`,
        },
        socket,
      ),
    );

    return Promise.all(clientRequests);
  }

  #sendMessageToSocket<TMessage extends KittenAnalystsMessageId>(
    message: KittenAnalystsMessage<TMessage>,
    socket: RemoteConnection,
  ): Promise<KittenAnalystsMessage<TMessage> | null> {
    const requestId = uuid();
    message.responseId = requestId;

    console.debug(`KSA-BE: <= ${identifyExchange(message)}...`);

    const request = new Promise<KittenAnalystsMessage<TMessage> | null>((resolve, reject) => {
      if (!socket.isAlive || socket.ws.readyState === WebSocket.CLOSED) {
        console.warn("KSA-BE: Send request can't be handled, because socket is dead!");
        socket.isAlive = false;
        resolve(null);
        return;
      }

      this.pendingRequests.set(requestId, { resolve, reject });
      socket.ws.send(JSON.stringify(message), error => {
        if (error) {
          reject(error);
        }
      });
    });

    return Promise.race([request, sleep(2000).then(() => null)]);
  }

  toHeadless<TMessage extends KittenAnalystsMessageId>(
    message: KittenAnalystsMessage<TMessage>,
  ): Promise<KittenAnalystsMessage<TMessage> | null> {
    if (isNil(this.#lastKnownHeadlessSocket)) {
      cwarn("No headless connection registered. Message is dropped.");
      return Promise.resolve(null);
    }

    if (!this.#lastKnownHeadlessSocket.isAlive) {
      cwarn(
        "Trying to send to headless session, but last known headless socket is no longer alive. Request is dropped!",
      );
      return Promise.resolve(null);
    }

    return this.#sendMessageToSocket(message, this.#lastKnownHeadlessSocket);
  }
}

const remote = new KittensGameRemote();

// Prometheus stuff

const cache = new Map<
  KittenAnalystsMessageId,
  Promise<
    Array<KittenAnalystsMessage<
      KittenAnalystsMessageId,
      PayloadBuildings | PayloadResources | PayloadStatistics
    > | null>
  >
>();
export type MessageCache = typeof cache;

const register = new Registry();

register.registerMetric(ks_iterate_duration);

register.registerMetric(kg_building_value(cache, remote));
register.registerMetric(kg_building_on(cache, remote));

register.registerMetric(kg_resource_value(cache, remote));
register.registerMetric(kg_resource_max_value(cache, remote));

// Metrics from in-game Stats

register.registerMetric(kg_buildings_constructed(cache, remote));
register.registerMetric(kg_challenges_completed_total(cache, remote));
register.registerMetric(kg_clicks_total(cache, remote));
register.registerMetric(kg_crafts_total(cache, remote));
register.registerMetric(kg_events_observed(cache, remote));
register.registerMetric(kg_kittens_average(cache, remote));
register.registerMetric(kg_kittens_dead(cache, remote));
register.registerMetric(kg_kittens_total(cache, remote));
register.registerMetric(kg_paragon_total(cache, remote));
register.registerMetric(kg_resets_total(cache, remote));
register.registerMetric(kg_trades_total(cache, remote));
register.registerMetric(kg_transcendence_tier(cache, remote));
register.registerMetric(kg_unicorns_sacrificed(cache, remote));
register.registerMetric(kg_years_total(cache, remote));

// HTTP API stuff

const routerMetrics = new Router();
routerMetrics.get("/", context => {
  context.body = "Kitten Analysts Command & Control Backend is running.";
});

routerMetrics.get("/metrics", async context => {
  try {
    context.body = await register.metrics();
    cache.clear();
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

const applicationMetrics = new Koa();
applicationMetrics.use(
  cors({
    origin(context) {
      return context.get("Origin") || "*";
    },
  }),
);
applicationMetrics.use(routerMetrics.routes());
applicationMetrics.listen(9091, () => {
  process.stderr.write("Prometheus metrics exporter listening on port 9091...\n");
});

// KGNet API

const routerNetwork = new Router();
routerNetwork.get("/user", context => {
  try {
    context.status = 200;
    context.body = { id: "you@ks-sync-service.internal" };
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});
routerNetwork.post("/user/login", context => {
  try {
    context.status = 200;
    context.body = { id: "you@ks-sync-service.internal" };
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

routerNetwork.get("/kgnet/save", context => {
  try {
    context.status = 200;
    context.body = [...saveStore.values()];
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

routerNetwork.post("/kgnet/save/upload", context => {
  try {
    console.debug(`KSA-BE: => Received savegame.`);

    const gameSave = context.request.body as KGNetSaveFromGame;
    const gameGUID = gameSave.guid;
    const calendar = gameSave.metadata.calendar;
    const savegame: KGNetSavePersisted = {
      archived: false,
      guid: gameGUID,
      index: { calendar: { day: calendar.day, year: calendar.year } },
      label: "Browser UI Save",
      saveData: gameSave.saveData,
      size: context.request.length,
      timestamp: Date.now(),
    };
    writeFileSync(`${LOCAL_STORAGE_PATH}/${gameGUID}.json`, JSON.stringify(savegame));
    saveStore.set(gameGUID, savegame);

    const savegameEphemeral: KGNetSavePersisted = {
      archived: false,
      guid: "ks-internal-savestate",
      index: { calendar: { day: calendar.day, year: calendar.year } },
      label: "Ephemeral Background Game",
      saveData: gameSave.saveData,
      size: context.request.length,
      timestamp: Date.now(),
    };
    writeFileSync(
      `${LOCAL_STORAGE_PATH}/ks-internal-savestate.json`,
      JSON.stringify(savegameEphemeral),
    );
    saveStore.set("ks-internal-savestate", savegameEphemeral);
    console.debug(`KSA-BE: => Savegame persisted to disc.`);

    console.warn(`KSA-BE: => Injecting savegame into headless session...`);
    remote
      .toHeadless({ type: "injectSavegame", data: savegameEphemeral })
      .catch(redirectErrorsToConsole(console));

    context.body = [...saveStore.values()];
    context.status = 200;
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

async function main() {
  try {
    const entries = await readdir(LOCAL_STORAGE_PATH);
    for (const entry of entries) {
      const path = join(LOCAL_STORAGE_PATH, entry);
      const value = await readFile(path, "utf-8");
      process.stderr.write(`Loading savegame '${entry}'...\n`);
      saveStore.set(entry.replace(/\.json$/, ""), JSON.parse(value) as KGNetSavePersisted);
    }
  } catch (_error) {
    process.stderr.write(`Unable to read savegames from '${LOCAL_STORAGE_PATH}'.\n`);
  }

  const applicationNetwork = new Koa();
  applicationNetwork.use(
    bodyParser({
      encoding: "utf-8",
      formLimit: "1000GB",
      jsonLimit: "1000GB",
      textLimit: "1000GB",
      xmlLimit: "1000GB",
    }),
  );
  applicationNetwork.use(
    cors({
      credentials: true,
      keepHeadersOnError: true,
      origin(context) {
        return context.get("Origin") || "*";
      },
    }),
  );
  applicationNetwork.use(routerNetwork.routes());
  applicationNetwork.listen(7780, () => {
    process.stderr.write("KGNet service layer listening on port 7780...\n");
  });
}

main().catch(redirectErrorsToConsole(console));
