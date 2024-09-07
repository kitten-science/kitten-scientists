import { Price, Resource } from "@kitten-science/kitten-scientists/types/index.js";

export const priceArrayToRecord = (prices: Array<Price>): Partial<Record<Resource, Price>> => {
  const base: Partial<Record<Resource, Price>> = {};
  return prices.reduce((record, price) => {
    record[price.name] = price;
    return record;
  }, base);
};
