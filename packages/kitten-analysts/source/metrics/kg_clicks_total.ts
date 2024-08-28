import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_clicks_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many times you have clicked.",
    name: "kg_clicks_total",
    labelNames: ["guid", "label", "location", "type"],
    require: "getStatistics",
    extract(guid, location, element, subject) {
      if (element.name !== "totalClicks") {
        return;
      }

      subject.set(
        {
          guid,
          label: ucfirst(element.label),
          location,
          type: element.type,
        },
        element.value,
      );
    },
  });
