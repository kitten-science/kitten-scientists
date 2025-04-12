import type { ColorScheme, Locale, Notation } from "./index.js";

export type KGConfig = {
  statics: {
    disableWebWorkers: boolean;
    locales: Array<Locale>;
    schemes: Array<ColorScheme>;
    notations: Array<Notation>;
  };
};
