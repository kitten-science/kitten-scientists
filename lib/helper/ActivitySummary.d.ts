import type { KittenScientists } from "../KittenScientists.js";
/**
 * The different sections of the summary.
 */
export type ActivitySummarySection =
  | "build"
  | "craft"
  | "faith"
  | "other"
  | "refine"
  | "research"
  | "trade"
  | "upgrade";
/**
 * Activities that are logged in the "other" section.
 */
export type ActivitySectionOther =
  | "accelerate"
  | "adore"
  | "distribute"
  | "embassy"
  | "feed"
  | "festival"
  | "fix.cry"
  | "hunt"
  | "praise"
  | "promote"
  | "stars"
  | "transcend";
export type Activity =
  | "accelerate"
  | "adore"
  | "build"
  | "craft"
  | "distribute"
  | "faith"
  | "festival"
  | "fixCry"
  | "hunt"
  | "praise"
  | "promote"
  | "research"
  | "star"
  | "timeSkip"
  | "trade"
  | "transcend"
  | "upgrade";
export type ActivityClass = `ks-${Activity}`;
export type ActivityTypeClass = `type_${ActivityClass}`;
export declare class ActivitySummary {
  private readonly _host;
  /**
   * The day at which the activity summary was last reset.
   */
  private _lastday;
  /**
   * The year at which the activity summary was last reset.
   */
  private _lastyear;
  /**
   * The individual sections/categories of the activity summary.
   */
  private _sections;
  constructor(host: KittenScientists);
  resetActivity(): void;
  storeActivity(name: string, amount?: number, section?: ActivitySummarySection): void;
  renderSummary(): Array<string>;
}
//# sourceMappingURL=ActivitySummary.d.ts.map
