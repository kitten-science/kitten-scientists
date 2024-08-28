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
    labelNames: ["guid", "name", "label", "location", "craftable"],
    require: "getResourcePool",
    extract(guid, location, element, subject) {
      subject.set(
        {
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
