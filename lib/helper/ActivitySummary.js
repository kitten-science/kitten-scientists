import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { roundToTwo, ucfirst } from "../tools/Format.js";
export class ActivitySummary {
  _host;
  /**
   * The day at which the activity summary was last reset.
   */
  _lastday;
  /**
   * The year at which the activity summary was last reset.
   */
  _lastyear;
  /**
   * The individual sections/categories of the activity summary.
   */
  _sections = new Map();
  constructor(host) {
    this._host = host;
    this.resetActivity();
  }
  resetActivity() {
    this._sections = new Map();
    this._lastday = this._host.game.calendar.day;
    this._lastyear = this._host.game.calendar.year;
  }
  storeActivity(name, amount = 1, section = "other") {
    if (!this._sections.has(section)) {
      this._sections.set(section, new Map());
    }
    const summarySection = mustExist(this._sections.get(section));
    if (!summarySection.has(name)) {
      summarySection.set(name, 0);
    }
    summarySection.set(name, mustExist(summarySection.get(name)) + amount);
  }
  renderSummary() {
    const summary = new Array();
    // Uncategorized items.
    if (this._sections.has("other")) {
      const section = mustExist(this._sections.get("other"));
      section.forEach((amount, name) =>
        summary.push(
          this._host.engine.i18n(`summary.${name}`, [this._host.game.getDisplayValueExt(amount)]),
        ),
      );
    }
    // Technologies.
    if (this._sections.has("research")) {
      const section = mustExist(this._sections.get("research"));
      section.forEach((_amount, name) => {
        summary.push(this._host.engine.i18n("summary.tech", [ucfirst(name)]));
      });
    }
    // Upgrades.
    if (this._sections.has("upgrade")) {
      const section = mustExist(this._sections.get("upgrade"));
      section.forEach((_amount, name) => {
        summary.push(this._host.engine.i18n("summary.upgrade", [ucfirst(name)]));
      });
    }
    // Upgrades.
    if (this._sections.has("build")) {
      const section = mustExist(this._sections.get("build"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.engine.i18n("summary.building", [
            this._host.game.getDisplayValueExt(amount),
            ucfirst(name),
          ]),
        );
      });
    }
    // Ziggurats
    if (this._sections.has("refine")) {
      const section = mustExist(this._sections.get("refine"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.engine.i18n("summary.refine", [
            this._host.game.getDisplayValueExt(amount),
            ucfirst(name),
          ]),
        );
      });
    }
    // Order of the sun.
    if (this._sections.has("faith")) {
      const section = mustExist(this._sections.get("faith"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.engine.i18n("summary.sun", [
            this._host.game.getDisplayValueExt(amount),
            ucfirst(name),
          ]),
        );
      });
    }
    // Crafts.
    if (this._sections.has("craft")) {
      const section = mustExist(this._sections.get("craft"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.engine.i18n("summary.craft", [
            this._host.game.getDisplayValueExt(amount),
            ucfirst(name),
          ]),
        );
      });
    }
    // Trades.
    if (this._sections.has("trade")) {
      const section = mustExist(this._sections.get("trade"));
      section.forEach((amount, name) => {
        summary.push(
          this._host.engine.i18n("summary.trade", [
            this._host.game.getDisplayValueExt(amount),
            ucfirst(name),
          ]),
        );
      });
    }
    if (this._lastday && this._lastyear) {
      let years = this._host.game.calendar.year - this._lastyear;
      let days = this._host.game.calendar.day - this._lastday;
      if (days < 0) {
        years -= 1;
        days += 400;
      }
      let duration = "";
      if (years > 0) {
        duration += `${years} `;
        duration +=
          years === 1
            ? this._host.engine.i18n("summary.year")
            : this._host.engine.i18n("summary.years");
      }
      if (days >= 0) {
        if (years > 0) duration += this._host.engine.i18n("summary.separator");
        duration += `${roundToTwo(days)} `;
        duration +=
          days === 1
            ? this._host.engine.i18n("summary.day")
            : this._host.engine.i18n("summary.days");
      }
      summary.push(this._host.engine.i18n("summary.head", [duration]));
    }
    return summary;
  }
}
//# sourceMappingURL=ActivitySummary.js.map
