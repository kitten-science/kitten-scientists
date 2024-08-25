import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { KittensGameRemote, MessageCache } from "../entrypoint-backend.js";
import { gaugeFactory } from "./factory.js";

export const kg_kittens_average = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "How many kittens were born per century at average.",
    name: "kg_kittens_average",
    labelNames: ["label", "location", "type"],
    require: "getStatistics",
    extract(location, element, subject) {
      if (element.name !== "averageKittens") {
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
