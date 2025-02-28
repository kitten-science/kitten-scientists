import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_festival_days = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "The remaining duration of the festival.",
    name: "kg_festival_days",
    labelNames: ["client_type", "guid", "location"] as const,
    require: "getCalendar",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          location,
        },
        element.festivalDays,
      );
    },
  });
