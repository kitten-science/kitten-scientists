import { CycleIndices } from "../../options/TimeControlSettings";
import { UserScript } from "../../UserScript";
import { SettingsList } from "./SettingsList";

export type SettingWithCycles = {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
};

/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export class CyclesList extends SettingsList {
  readonly setting: SettingWithCycles;

  readonly 0: JQuery<HTMLElement>;
  readonly 1: JQuery<HTMLElement>;
  readonly 2: JQuery<HTMLElement>;
  readonly 3: JQuery<HTMLElement>;
  readonly 4: JQuery<HTMLElement>;
  readonly 5: JQuery<HTMLElement>;
  readonly 6: JQuery<HTMLElement>;
  readonly 7: JQuery<HTMLElement>;
  readonly 8: JQuery<HTMLElement>;
  readonly 9: JQuery<HTMLElement>;

  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   */
  constructor(host: UserScript, setting: SettingWithCycles) {
    super(host);
    this.setting = setting;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      this[cycleIndex as CycleIndices] = this._getCycle(cycleIndex as CycleIndices, this.setting);
      this.element.append(this[cycleIndex as CycleIndices]);
    }
  }

  private _getCycle(index: CycleIndices, option: SettingWithCycles): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      text: cycle.title,
    });

    const input = $("<input/>", {
      type: "checkbox",
    });

    input.on("change", () => {
      if (input.is(":checked") && option[index] === false) {
        this._host.updateOptions(() => (option[index] = true));
        this._host.engine.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] === true) {
        this._host.updateOptions(() => (option[index] = false));
        this._host.engine.imessage("time.skip.cycle.disable", [cycle.title]);
      }
    });

    label.prepend(input);
    element.append(input);

    return element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
