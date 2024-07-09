import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_years_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many years you've played.",
    name: "kg_years_total",
    labelNames: ["label", "location", "type"],
    require: "getStatistics",
    extract(location, element, subject) {
      if (element.name !== "totalYears") {
        return;
      }

      subject.set(
        {
          label: ucfirst(element.label),
          location,
          type: element.type,
        },
        element.value,
      );
    },
  });
