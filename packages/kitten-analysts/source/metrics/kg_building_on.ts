import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_building_on = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many of the given building are turned on.",
    name: "kg_building_on",
    labelNames: ["name", "label", "location", "tab"],
    require: "getBuildings",
    extract(location, element, subject) {
      subject.set(
        {
          name: element.name,
          label: ucfirst(element.label),
          location,
          tab: element.tab,
        },
        element.on,
      );
    },
  });