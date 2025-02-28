import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { Gauge } from "prom-client";
import type {
  PayloadBuildings,
  PayloadCalendar,
  PayloadPollution,
  PayloadRaces,
  PayloadResources,
  PayloadStatistics,
  PayloadTechnologies,
} from "../KittenAnalysts.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";

export const gaugeFactory = <
  TMessage extends
    | "getBuildings"
    | "getCalendar"
    | "getPollution"
    | "getRaces"
    | "getResourcePool"
    | "getStatistics"
    | "getTechnologies",
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TData extends
    | PayloadBuildings
    | PayloadCalendar
    | PayloadPollution
    | PayloadRaces
    | PayloadResources
    | PayloadStatistics
    | PayloadTechnologies = TMessage extends "getBuildings"
    ? PayloadBuildings
    : TMessage extends "getCalendar"
      ? PayloadCalendar
      : TMessage extends "getPollution"
        ? PayloadPollution
        : TMessage extends "getRaces"
          ? PayloadRaces
          : TMessage extends "getResourcePool"
            ? PayloadResources
            : TMessage extends "getStatistics"
              ? PayloadStatistics
              : TMessage extends "getTechnologies"
                ? PayloadTechnologies
                : never,
>(instructions: {
  cache: MessageCache;
  remote: KittensGameRemote;
  help: string;
  name: string;
  labelNames: Array<string>;
  require: TMessage;
  extract: (
    client_type: "backend" | "browser" | "headless",
    guid: string,
    location: string,
    element: TData[number],
    subject: Gauge,
  ) => void;
}) =>
  new Gauge({
    help: instructions.help,
    name: instructions.name,
    labelNames: instructions.labelNames,
    async collect() {
      if (!instructions.cache.has(instructions.require)) {
        instructions.cache.set(
          instructions.require,
          instructions.remote.sendMessage({ type: instructions.require }),
        );
      }
      const response = await instructions.cache.get(instructions.require);
      if (isNil(response)) {
        return;
      }

      for (const clientResponse of response) {
        if (clientResponse === null) {
          continue;
        }
        for (const entity of mustExist(clientResponse.data) as TData) {
          instructions.extract(
            clientResponse.client_type,
            clientResponse.guid,
            clientResponse.location,
            entity,
            this,
          );
        }
      }
    },
  });
