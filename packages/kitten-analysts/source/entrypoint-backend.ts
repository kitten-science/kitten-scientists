import { FrameContext } from "@kitten-science/kitten-scientists";
import cors from "@koa/cors";
import { sleep } from "@oliversalzburg/js-utils/async/async.js";
import { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import Koa from "koa";
import Router from "koa-router";
import { writeFileSync } from "node:fs";
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

const ks_iterate_duration = new Histogram({
  name: "ks_iterate_duration",
  help: "How long each iteration of KS took.",
  buckets: [...linearBuckets(0, 1, 100), ...exponentialBuckets(100, 1.125, 30)],
  labelNames: ["location", "manager"],
});

// Websocket stuff

export class KittensGameRemote {
  wss: WebSocketServer;
  sockets = new Array<{ ws: WebSocket; isAlive: boolean }>();

  pendingRequests = new Map<string, { resolve: AnyFunction; reject: AnyFunction }>();

  constructor(port = 9093) {
    this.wss = new WebSocketServer({ port });

    this.wss.on("listening", () => {
      process.stderr.write(`WS server listening on port ${port}...\n`);
    });

    this.wss.on("connection", ws => {
      ws.on("error", console.error);

      const socket = { ws, isAlive: true };
      this.sockets.push(socket);
      ws.on("pong", () => {
        socket.isAlive = true;
      });

      ws.on("message", data => {
        this.handleMessage(data);
      });

      void this.sendMessage({ type: "connected" });
    });

    const interval = setInterval(() => {
      this.wss.clients.forEach(ws => {
        const socket = this.sockets.find(socket => socket.ws === ws);
        if (isNil(socket)) {
          console.warn("Invalid socket reference!");
          return;
        }

        if (!socket.isAlive) {
          socket.ws.terminate();
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

  handleMessage(data: RawData) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const message = JSON.parse(data.toString()) as KittenAnalystsMessage<KittenAnalystsMessageId>;

    if (!message.responseId) {
      switch (message.type) {
        case "reportFrame": {
          const payload = message.data as FrameContext;
          const delta = payload.exit - payload.entry;
          console.debug(`KSA-BE: => Received frame report.`, delta);

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
          const payload = message.data as Record<string, unknown>;
          console.debug(`KSA-BE: => Received savegame.`);
          writeFileSync(
            `${LOCAL_STORAGE_PATH}/com.nuclearunicorn.kittengame.savedata`,
            JSON.stringify(payload),
          );
          console.debug(`KSA-BE: => Savegame persisted to disc.`);
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
      console.warn(`KSA-BE: => Request ID '${message.responseId}' is unexpected! Message ignored.`);
      return;
    }

    const pendingRequest = this.pendingRequests.get(message.responseId);
    this.pendingRequests.delete(message.responseId);

    pendingRequest?.resolve(message);
    console.info(`KSA-BE: => Request ID '${message.responseId}' resolved.`);
  }

  sendMessage<TMessage extends KittenAnalystsMessageId>(
    message: KittenAnalystsMessage<TMessage>,
  ): Promise<Array<KittenAnalystsMessage<TMessage> | null>> {
    const clientRequests = this.sockets.map(socket => {
      const requestId = uuid();
      console.info(`KSA-BE: <= Request ID '${requestId}' sent...`);

      const request = new Promise<KittenAnalystsMessage<TMessage> | null>((resolve, reject) => {
        if (socket.ws.readyState === WebSocket.CLOSED) {
          console.warn("KSA-BE: WS connection closed unexpectedly!");
          socket.isAlive = false;
          resolve(null);
          return;
        }

        this.pendingRequests.set(requestId, { resolve, reject });
        socket.ws.send(JSON.stringify({ responseId: requestId, ...message }), error => {
          if (error) {
            reject(error);
          }
        });
      });

      return Promise.race([request, sleep(2000).then(() => null)]);
    });

    return Promise.all(clientRequests);
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
    context.body = { id: "ks-sync-service" };
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});
routerNetwork.post("/user/login", context => {
  try {
    context.status = 200;
    context.body = { id: "ks-sync-service" };
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});
routerNetwork.get("/kgnet/save", context => {
  try {
    context.status = 200;
    context.body = [
      {
        guid: "ks-internal-savestate",
        archived: false,
        label: "Ephemeral Save Sync",
        index: {
          calendar: {
            day: 1,
            year: 2024,
          },
        },
        timestamp: Date.now(),
        size: 1337,
      },
    ];
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});
routerNetwork.post("/kgnet/save/upload", context => {
  try {
    console.debug(`KSA-BE: => Received savegame.`);
    writeFileSync(
      `${LOCAL_STORAGE_PATH}/com.nuclearunicorn.kittengame.savedata`,
      JSON.stringify(context.body),
    );
    console.debug(`KSA-BE: => Savegame persisted to disc.`);
    context.status = 200;
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

const applicationNetwork = new Koa();
applicationNetwork.use(
  cors({
    credentials: true,
    origin(context) {
      return context.get("Origin") || "*";
    },
  }),
);
applicationNetwork.use(routerNetwork.routes());
applicationNetwork.listen(7780, () => {
  process.stderr.write("KGNet service layer listening on port 7780...\n");
});
