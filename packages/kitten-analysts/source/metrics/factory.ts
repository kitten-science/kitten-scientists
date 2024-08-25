import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { Gauge } from "prom-client";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { PayloadBuildings, PayloadResources, PayloadStatistics } from "../KittenAnalysts.js";

export const gaugeFactory = <
  TMessage extends "getBuildings" | "getResourcePool" | "getStatistics",
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TData extends
    | PayloadBuildings
    | PayloadResources
    | PayloadStatistics = TMessage extends "getBuildings"
    ? PayloadBuildings
    : TMessage extends "getResourcePool"
      ? PayloadResources
      : TMessage extends "getStatistics"
        ? PayloadStatistics
        : never,
>(instructions: {
  cache: MessageCache;
  remote: KittensGameRemote;
  help: string;
  name: string;
  labelNames: Array<string>;
  require: TMessage;
  extract: (location: string, element: TData[number], subject: Gauge) => void;
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
          instructions.extract(clientResponse.location ?? "", entity, this);
        }
      }
    },
  });
