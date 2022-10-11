import { CycleIndices, TimeControlSettings } from "../options/TimeControlSettings";
import { TimeSkipSettings } from "../options/TimeSkipSettings";
import { ucfirst } from "../tools/Format";
import { Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { ResetSettingsUi } from "./ResetSettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeControlSettingsUi extends SettingsSectionUi {
  protected readonly _buildings: Array<SettingListItem>;
  private readonly _settings: TimeControlSettings;

  constructor(host: UserScript, settings: TimeControlSettings) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(host, label, settings);

    this._settings = settings;

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this._settings.load(new TimeControlSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getOptionAccelerateTime(
        this._settings.accelerateTime,
        this._host.engine.i18n("option.accelerate")
      ),

      this._getOptionTimeSkip(this._settings.timeSkip, this._host.engine.i18n("option.time.skip")),

      new ResetSettingsUi(this._host, this._settings.reset),
    ];

    for (const setting of this._buildings) {
      this.list.append(setting.element);
    }
  }

  private _getOptionTimeSkip(
    option: TimeControlSettings["timeSkip"],
    label: string
  ): SettingTriggerListItem {
    const element = new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

    const maximumButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m24 36.05-2.15-2.1 8.45-8.45H4v-3h26.3l-8.4-8.45 2.1-2.1L36.05 24ZM41 36V12h3v24Z"/></svg>',
      title: this._host.engine.i18n("ui.maximum"),
    }).addClass("ks-icon-button");
    option.$maximum = maximumButton;

    maximumButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("ui.max.set", [this._host.engine.i18n("option.time.skip")]),
        option.maximum.toFixed(0)
      );

      if (value !== null) {
        this._host.updateOptions(() => (option.maximum = value));
        maximumButton[0].title = option.maximum.toFixed(0);
      }
    });

    const cyclesButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v15h-3v-5.5H9V41h16.2v3Zm29 4q-3.65 0-6.375-2.275T28.2 40h3.1q.65 2.2 2.475 3.6Q35.6 45 38 45q2.9 0 4.95-2.05Q45 40.9 45 38q0-2.9-2.05-4.95Q40.9 31 38 31q-1.45 0-2.7.525-1.25.525-2.2 1.475H36v3h-8v-8h3v2.85q1.35-1.3 3.15-2.075Q35.95 28 38 28q4.15 0 7.075 2.925T48 38q0 4.15-2.925 7.075T38 48ZM9 16.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("ui.cycles"),
    }).addClass("ks-icon-button");

    const cyclesList = new SettingsList(this._host);

    for (
      let cycleIndex = 0;
      cycleIndex < this._host.gamePage.calendar.cycles.length;
      ++cycleIndex
    ) {
      cyclesList.element.append(this._getCycle(cycleIndex as CycleIndices, option));
    }

    const seasonsButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    const seasonsList = new SettingsList(this._host);

    // fill out the list with seasons
    seasonsList.element.append(this._getSeasonForTimeSkip("spring", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("summer", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("autumn", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("winter", option));

    cyclesButton.on("click", function () {
      cyclesList.element.toggle();
      seasonsList.element.toggle(false);
    });

    seasonsButton.on("click", function () {
      cyclesList.element.toggle(false);
      seasonsList.element.toggle();
    });

    element.element.append(
      cyclesButton,
      seasonsButton,
      maximumButton,
      cyclesList.element,
      seasonsList.element
    );

    return element;
  }

  private _getOptionAccelerateTime(
    option: TimeControlSettings["accelerateTime"],
    label: string
  ): SettingTriggerListItem {
    return new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });
  }

  private _getCycle(
    index: CycleIndices,
    option: TimeControlSettings["timeSkip"]
  ): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      text: cycle.title,
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${index}` as const] = input;

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

  private _getSeasonForTimeSkip(season: Season, option: TimeSkipSettings): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.engine.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.engine.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.engine.imessage("time.skip.season.disable", [iseason]);
      }
    });

    label.prepend(input);
    element.append(label);

    return element;
  }
}
