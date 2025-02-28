import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_crypto_price = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    remote,
    help: "The current price of blackcoin.",
    name: "kg_crypto_price",
    labelNames: ["client_type", "guid", "location"] as const,
    require: "getCalendar",
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          location,
        },
        element.cryptoPrice,
      );
    },
  });
