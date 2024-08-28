import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_kittens_dead = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many kittens have died :(",
    name: "kg_kittens_dead",
    labelNames: ["guid", "label", "location", "type"],
    require: "getStatistics",
    extract(guid, location, element, subject) {
      if (element.name !== "kittensDead") {
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
