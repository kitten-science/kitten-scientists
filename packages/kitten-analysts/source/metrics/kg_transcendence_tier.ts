import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_transcendence_tier = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "Your current transcendence tier.",
    name: "kg_transcendence_tier",
    labelNames: ["guid", "label", "location", "type"],
    require: "getStatistics",
    extract(guid, location, element, subject) {
      if (element.name !== "transcendenceTier") {
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
