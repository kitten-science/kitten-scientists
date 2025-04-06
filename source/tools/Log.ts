export const cl = <T extends Array<unknown>>(...args: T): Array<string | T[number]> => [
  "👩‍🔬",
  ...args.filter(arg => arg !== ""),
];
