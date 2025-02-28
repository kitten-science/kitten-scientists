import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { roundTo } from "@oliversalzburg/js-utils/math/core.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_resource_max_value = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "The current limit of your storage pool for the given resource.",
    name: "kg_resource_max_value",
    labelNames: ["client_type", "guid", "name", "label", "location", "craftable"] as const,
    require: "getResourcePool",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          name: element.name,
          label: ucfirst(element.label),
          location,
          craftable: element.craftable.toString(),
        },
        roundTo(element.maxValue, 2),
      );
    },
  });
