import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_crafts_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many times you have crafted.",
    name: "kg_crafts_total",
    labelNames: ["client_type", "guid", "label", "location", "type"],
    require: "getStatistics",
    extract(client_type, guid, location, element, subject) {
      if (element.name !== "totalCrafts") {
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
