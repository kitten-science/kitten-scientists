import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import { MessageCache } from "../entrypoint-backend.js";
import { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_tech_unlocked = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "Has the given technology been unlocked?",
    name: "kg_tech_unlocked",
    labelNames: ["client_type", "client_type", "guid", "name", "label", "location", "tab"] as const,
    require: "getTechnologies",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
          tab: element.tab,
        },
        element.unlocked ? 1 : 0,
      );
    },
  });