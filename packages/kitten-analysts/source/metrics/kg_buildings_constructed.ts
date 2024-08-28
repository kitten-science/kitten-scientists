import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_buildings_constructed = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many buildings you have constructed.",
    name: "kg_buildings_constructed",
    labelNames: ["client_type", "guid", "label", "location", "type"],
    require: "getStatistics",
    extract(client_type, guid, location, element, subject) {
      if (element.name !== "buildingsConstructed") {
        return;
      }

      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.label),
          location,
          type: element.type,
        },
        element.value,
      );
    },
  });
