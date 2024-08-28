import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { roundTo } from "@oliversalzburg/js-utils/math/core.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_resource_value = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many of the given resource are in your resource pool.",
    name: "kg_resource_value",
    labelNames: ["client_type", "guid", "name", "label", "location", "craftable"],
    require: "getResourcePool",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          craftable: element.craftable.toString(),
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
        },
        roundTo(element.value, 2),
      );
    },
  });
