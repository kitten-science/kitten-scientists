import { roundToTwo, ucfirst } from "./tools/Format";
import { mustExist } from "./tools/Maybe";
import { UserScript } from "./UserScript";

/**
 * The different sections of the summary.
 */
export type ActivitySummarySection =
  | "build"
  | "craft"
  | "faith"
  | "other"
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

export type Activitiy =
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
export type ActivityClass = `ks-${Activitiy}`;
export type ActivityTypeClass = `type_${ActivityClass}`;

export class ActivitySummary {
  private readonly _host: UserScript;

  /**
   * The day at which the activity summary was last reset.
   */
  private _lastday: number | undefined;

  /**
   * The year at which the activity summary was last reset.
   */
  private _lastyear: number | undefined;

  /**
   * The individual sections/categories of the activity summary.
   */
  private _sections = new Map<ActivitySummarySection, Map<string, number>>();

  constructor(host: UserScript) {
    this._host = host;
  }

  resetActivity(): void {
    this._sections = new Map<ActivitySummarySection, Map<string, number>>();
    this._lastday = this._host.gamePage.calendar.day;
    this._lastyear = this._host.gamePage.calendar.year;
  }

  storeActivity(name: string, amount = 1, section: ActivitySummarySection = "other"): void {
    if (!this._sections.has(section)) {
      this._sections.set(section, new Map<ActivitySectionOther, number>());
    }
    const summarySection = mustExist(this._sections.get(section));

    if (!summarySection.has(name)) {
      summarySection.set(name, 0);
    }
    summarySection.set(name, mustExist(summarySection.get(name)) + amount);
  }

  renderSummary(): Array<string> {
    const summary = new Array<string>();

    // Uncategorized items.
    if (this._sections.has("other")) {
      const section = mustExist(this._sections.get("other")) as Map<ActivitySectionOther, number>;
      section.forEach((amount, name) =>
        summary.push(
          this._host.i18n(`summary.${name}` as const, [
            this._host.gamePage.getDisplayValueExt(amount),
          ])
        )
      );
    }

    // Technologies.
    if (this._sections.has("research")) {
      const section = mustExist(this._sections.get("research"));
      section.forEach((amount, name) => {
        summary.push(this._host.i18n("summary.tech", [ucfirst(name)]));
      });
    }

    // Upgrades.
    if (this._sections.has("upgrade")) {
      const section = mustExist(this._sections.get("upgrade"));
      section.forEach((amount, name) => {
        summary.push(this._host.i18n("summary.upgrade", [ucfirst(name)]));
      });
    }

    // Upgrades.
    if (this._sections.has("build")) {
      const section = mustExist(this._sections.get("build"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.i18n("summary.building", [
            this._host.gamePage.getDisplayValueExt(amount),
            ucfirst(name),
          ])
        );
      });
    }

    // Order of the sun.
    if (this._sections.has("faith")) {
      const section = mustExist(this._sections.get("faith"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.i18n("summary.sun", [
            this._host.gamePage.getDisplayValueExt(amount),
            ucfirst(name),
          ])
        );
      });
    }

    // Crafts.
    if (this._sections.has("craft")) {
      const section = mustExist(this._sections.get("craft"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.i18n("summary.craft", [
            this._host.gamePage.getDisplayValueExt(amount),
            ucfirst(name),
          ])
        );
      });
    }

    // Trades.
    if (this._sections.has("trade")) {
      const section = mustExist(this._sections.get("trade"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.i18n("summary.trade", [
            this._host.gamePage.getDisplayValueExt(amount),
            ucfirst(name),
          ])
        );
      });
    }

    if (this._lastday && this._lastyear) {
      let years = this._host.gamePage.calendar.year - this._lastyear;
      let days = this._host.gamePage.calendar.day - this._lastday;

      if (days < 0) {
        years -= 1;
        days += 400;
      }

      let duration = "";
      if (years > 0) {
        duration += years + " ";
        duration +=
          years === 1 ? this._host.i18n("summary.year") : this._host.i18n("summary.years");
      }

      if (days >= 0) {
        if (years > 0) duration += this._host.i18n("summary.separator");
        duration += roundToTwo(days) + " ";
        duration += days === 1 ? this._host.i18n("summary.day") : this._host.i18n("summary.days");
      }

      summary.push(this._host.i18n("summary.head", [duration]));
    }

    return summary;
  }
}
