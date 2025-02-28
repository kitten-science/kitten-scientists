import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_pollution_production = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How much pollution buildings currently generate.",
    name: "kg_pollution_production",
    labelNames: ["client_type", "guid", "label", "location", "name"] as const,
    require: "getPollution",
    extract(client_type, guid, location, element, subject) {
      // This is tracked in kg_pollution_total
      if (element.name === "cathPollution") {
        return;
      }

      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
        },
        element.pollution,
      );
    },
  });
