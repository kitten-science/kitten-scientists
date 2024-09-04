import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { MessageCache } from "../entrypoint-backend.js";
import { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_building_on = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many of the given building are turned on.",
    name: "kg_building_on",
    labelNames: ["client_type", "group", "guid", "name", "label", "location", "tab"] as const,
    require: "getBuildings",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          group: element.group,
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
          tab: element.tab,
        },
        element.on,
      );
    },
  });
