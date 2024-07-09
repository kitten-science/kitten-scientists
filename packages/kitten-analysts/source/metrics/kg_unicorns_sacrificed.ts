import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_unicorns_sacrificed = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many unicorns you have sacrificed so far.",
    name: "kg_unicorns_sacrificed",
    labelNames: ["label", "location", "type"],
    require: "getStatistics",
    extract(location, element, subject) {
      if (element.name !== "unicornsSacrificed") {
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
