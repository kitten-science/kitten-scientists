import type { KittenAnalystsMessage, KittenAnalystsMessageId } from "../KittenAnalysts.js";

export const identifyMessage = (message: KittenAnalystsMessage<KittenAnalystsMessageId>) =>
  `${message.type}<${message.responseId ?? "terminal"}>`;

export const identifyExchange = (message: KittenAnalystsMessage<KittenAnalystsMessageId>) =>
  `'${message.location}': ${identifyMessage(message)}`;
