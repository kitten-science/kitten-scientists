import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_building_value = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many of the given building have been built.",
    name: "kg_building_value",
    labelNames: ["guid", "name", "label", "location", "tab"],
    require: "getBuildings",
    extract(guid, location, element, subject) {
      subject.set(
        {
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
          tab: element.tab,
        },
        element.value,
      );
    },
  });
