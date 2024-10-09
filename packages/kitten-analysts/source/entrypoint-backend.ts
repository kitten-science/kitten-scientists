import {
  KGNetSaveFromGame,
  KGNetSavePersisted,
  KGNetSaveUpdate,
  KGSaveData,
} from "@kitten-science/kitten-scientists/types/index.js";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import Koa from "koa";
import Router from "koa-router";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { writeFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Registry } from "prom-client";
import { LOCAL_STORAGE_PATH } from "./globals.js";
import {
  KittenAnalystsMessage,
  KittenAnalystsMessageId,
  PayloadBuildings,
  PayloadCalendar,
  PayloadRaces,
  PayloadResources,
  PayloadStatistics,
  PayloadTechnologies,
} from "./KittenAnalysts.js";
import { kg_building_on } from "./metrics/kg_building_on.js";
import { kg_building_value } from "./metrics/kg_building_value.js";
import { kg_buildings_constructed } from "./metrics/kg_buildings_constructed.js";
import { kg_challenges_completed_total } from "./metrics/kg_challenges_completed_total.js";
import { kg_clicks_total } from "./metrics/kg_clicks_total.js";
import { kg_crafts_total } from "./metrics/kg_crafts_total.js";
import { kg_crypto_price } from "./metrics/kg_crypto_price.js";
import { kg_embassy_level } from "./metrics/kg_embassy_level.js";
import { kg_events_observed } from "./metrics/kg_events_observed.js";
import { kg_festival_days } from "./metrics/kg_festival_days.js";
import { kg_kittens_average } from "./metrics/kg_kittens_average.js";
import { kg_kittens_dead } from "./metrics/kg_kittens_dead.js";
import { kg_kittens_total } from "./metrics/kg_kittens_total.js";
import { kg_paragon_total } from "./metrics/kg_paragon_total.js";
import { kg_race_energy } from "./metrics/kg_race_energy.js";
import { kg_race_standing } from "./metrics/kg_race_standing.js";
import { kg_resets_total } from "./metrics/kg_resets_total.js";
import { kg_resource_max_value } from "./metrics/kg_resource_max_value.js";
import { kg_resource_rate } from "./metrics/kg_resource_rate.js";
import { kg_resource_value } from "./metrics/kg_resource_value.js";
import { kg_tech_researched } from "./metrics/kg_tech_researched.js";
import { kg_tech_unlocked } from "./metrics/kg_tech_unlocked.js";
import { kg_trades_total } from "./metrics/kg_trades_total.js";
import { kg_transcendence_tier } from "./metrics/kg_transcendence_tier.js";
import { kg_unicorns_sacrificed } from "./metrics/kg_unicorns_sacrificed.js";
import { kg_years_total } from "./metrics/kg_years_total.js";
import { KittensGameRemote } from "./network/KittensGameRemote.js";

export interface KGNetChiralCommand {
  command: string;
}

const PORT_HTTP_KGNET = process.env.PORT_HTTP_KGNET ? Number(process.env.PORT_HTTP_KGNET) : 7780;
const PORT_HTTP_METRICS = process.env.PORT_WS_BACKEND
  ? Number(process.env.PORT_HTTP_METRICS)
  : 9091;
const PORT_WS_BACKEND = process.env.PORT_WS_BACKEND ? Number(process.env.PORT_WS_BACKEND) : 9093;
const PROTOCOL_DEBUG = Boolean(process.env.PROTOCOL_DEBUG);

const saveStore = new Map<string, KGNetSavePersisted>();
saveStore.set("ka-internal-savestate", {
  guid: "ka-internal-savestate",
  archived: false,
  label: "Background Game",
  index: {
    calendar: {
      day: 0,
      year: 0,
    },
  },
  timestamp: 0,
  saveData: "",
  size: 0,
});

// Websocket stuff

const remote = new KittensGameRemote(saveStore, PORT_WS_BACKEND, PROTOCOL_DEBUG);

// Prometheus stuff

const cache = new Map<
  KittenAnalystsMessageId,
  Promise<
    Array<KittenAnalystsMessage<
      KittenAnalystsMessageId,
      | PayloadBuildings
      | PayloadCalendar
      | PayloadRaces
      | PayloadResources
      | PayloadStatistics
      | PayloadTechnologies
    > | null>
  >
>();
export type MessageCache = typeof cache;

const register = new Registry();

register.registerMetric(remote.ks_iterate_duration);

register.registerMetric(kg_building_value(cache, remote));
register.registerMetric(kg_building_on(cache, remote));

register.registerMetric(kg_resource_value(cache, remote));
register.registerMetric(kg_resource_max_value(cache, remote));
register.registerMetric(kg_resource_rate(cache, remote));

register.registerMetric(kg_embassy_level(cache, remote));
register.registerMetric(kg_race_energy(cache, remote));
register.registerMetric(kg_race_standing(cache, remote));

register.registerMetric(kg_crypto_price(cache, remote));
register.registerMetric(kg_festival_days(cache, remote));

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
register.registerMetric(kg_tech_researched(cache, remote));
register.registerMetric(kg_tech_unlocked(cache, remote));
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
applicationMetrics.listen(PORT_HTTP_METRICS, () => {
  process.stderr.write(`Prometheus metrics exporter listening on port ${PORT_HTTP_METRICS}...\n`);
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
    if (PROTOCOL_DEBUG) process.stderr.write(`=> Received savegame.`);

    const gameSave = context.request.body as KGNetSaveFromGame;
    const gameGUID = gameSave.guid;
    const calendar = gameSave.metadata.calendar;
    const savegame: KGNetSavePersisted = {
      archived: false,
      guid: gameGUID,
      index: { calendar: { day: calendar.day, year: calendar.year } },
      label: "Browser Game",
      saveData: gameSave.saveData,
      size: context.request.length,
      timestamp: Date.now(),
    };
    saveStore.set(gameGUID, savegame);
    writeFileSync(`${LOCAL_STORAGE_PATH}/${gameGUID}.json`, JSON.stringify(savegame));

    // Rebuild payload to also contain the fixed-string telemetry GUID.
    const uncompressed = JSON.parse(decompressFromUTF16(gameSave.saveData)) as KGSaveData;
    uncompressed.telemetry.guid = "ka-internal-savestate";
    const recompressedSaveData = compressToUTF16(JSON.stringify(uncompressed));

    const savegameEphemeral: KGNetSavePersisted = {
      archived: false,
      guid: "ka-internal-savestate",
      index: { calendar: { day: calendar.day, year: calendar.year } },
      label: "Background Game",
      saveData: recompressedSaveData,
      size: context.request.length,
      timestamp: Date.now(),
    };
    saveStore.set("ka-internal-savestate", savegameEphemeral);
    writeFileSync(
      `${LOCAL_STORAGE_PATH}/ka-internal-savestate.json`,
      JSON.stringify(savegameEphemeral),
    );

    process.stderr.write(`=> Savegame persisted to disc.\n`);

    process.stderr.write(`=> Injecting savegame into headless session...\n`);
    remote
      .toHeadless({
        type: "injectSavegame",
        data: savegameEphemeral,
      })
      .catch(redirectErrorsToConsole(console));

    context.body = [...saveStore.values()];
    context.status = 200;
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});
routerNetwork.post("/kgnet/save/update", context => {
  try {
    process.stderr.write(`=> Received savegame update.\n`);

    const gameSave = context.request.body as KGNetSaveUpdate;
    const gameGUID = gameSave.guid;
    const existingSave = saveStore.get(gameGUID);
    if (isNil(existingSave)) {
      process.stderr.write(
        `=> Couldn't find existing savegame with ID '${gameGUID}'! Update is ignored.\n`,
      );
      return;
    }

    existingSave.archived = gameSave.metadata?.archived === "true";
    existingSave.label = gameSave.metadata?.label ?? existingSave.label;
    writeFileSync(`${LOCAL_STORAGE_PATH}/${gameGUID}.json`, JSON.stringify(existingSave));
    saveStore.set(gameGUID, existingSave);
    process.stderr.write(`=> Savegame persisted to disc.\n`);

    context.body = [...saveStore.values()];
    context.status = 200;
    return;
  } catch (error) {
    console.error(error);
    context.status = 500;
  }
});

routerNetwork.post("/kgnet/chiral/game/command/", context => {
  try {
    //const payload = context.request.body as KGNetChiralCommand;
    context.status = 200;
    context.body = JSON.stringify({
      clientState: `Command received at ${new Date().toISOString()}.`,
    });
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
  applicationNetwork.listen(PORT_HTTP_KGNET, () => {
    process.stderr.write(`KGNet service layer listening on port ${PORT_HTTP_KGNET}...\n`);
  });
}

["SIGINT", "SIGTERM", "SIGQUIT"].forEach(signal =>
  process.on(signal, () => {
    remote.closeAll();
    process.exit();
  }),
);

main().catch(redirectErrorsToConsole(console));
