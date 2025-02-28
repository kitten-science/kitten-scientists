import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_kittens_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many kittens you've had throughout your game.",
    name: "kg_kittens_total",
    labelNames: ["client_type", "guid", "label", "location", "type"] as const,
    require: "getStatistics",
    extract(client_type, guid, location, element, subject) {
      if (element.name !== "totalKittens") {
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
