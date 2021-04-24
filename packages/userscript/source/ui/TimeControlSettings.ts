import { Options } from "../Options";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSection } from "./SettingsSection";

export class TimeControlSettings extends SettingsSection {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: Options["auto"]["timeCtrl"];

  private readonly _itemsButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(
    host: UserScript,
    religionOptions: Options["auto"]["timeCtrl"] = host.options.auto.timeCtrl
  ) {
    super(host);

    this._options = religionOptions;

    const toggleName = "timeCtrl";

    const itext = ucfirst(this._host.i18n("ui.timeCtrl"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    element.append(input, label);

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: this._host.i18n("ui.items"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._itemsButton.on("click", () => {
      list.toggle();
    });

    this._buildingButtons = [
      this._getTimeCtrlOption(
        "accelerateTime",
        this._options.items.accelerateTime,
        this._host.i18n("option.accelerate")
      ),
      this._getTimeCtrlOption(
        "timeSkip",
        this._options.items.timeSkip,
        this._host.i18n("option.time.skip")
      ),
      this._getTimeCtrlOption(
        "reset",
        this._options.items.reset,
        this._host.i18n("option.time.reset")
      ),
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private _getTimeCtrlOption(
    name: string,
    option: { enabled: boolean; label: string; maximum: number; subTrigger: number },
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);

    if (name == "timeSkip") {
      const triggerButton = $("<div/>", {
        id: "set-timeSkip-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      triggerButton.on("click", () => {
        const value = window.prompt(
          this._host.i18n("time.skip.trigger.set", []),
          option.subTrigger
        );

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      const maximunButton = $("<div/>", {
        id: "set-timeSkip-maximum",
        text: this._host.i18n("ui.maximum"),
        title: option.max,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      maximunButton.on("click", () => {
        const value = window.prompt(
          this._host.i18n("ui.max.set", [this._host.i18n("option.time.skip")]),
          option.maximum
        );

        if (value !== null) {
          option.maximum = parseFloat(value);
          kittenStorage.items[maximunButton.attr("id")] = option.maximum;
          this._host.saveToKittenStorage();
          maximunButton[0].title = option.maximum;
        }
      });

      const cyclesButton = $("<div/>", {
        id: "toggle-cycle-" + name,
        text: this._host.i18n("ui.cycles"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      const cyclesList = $("<ul/>", {
        id: "cycles-list-" + name,
        css: { display: "none", paddingLeft: "20px" },
      });

      for (const i in this._host.gamePage.calendar.cycles) {
        cyclesList.append(this._getCycle(i, option));
      }

      const seasonsButton = $("<div/>", {
        id: "toggle-seasons-" + name,
        text: this._host.i18n("trade.seasons"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      const seasonsList = $("<ul/>", {
        id: "seasons-list-" + name,
        css: { display: "none", paddingLeft: "20px" },
      });

      // fill out the list with seasons
      seasonsList.append(this._getSeasonForTimeSkip("spring", option));
      seasonsList.append(this._getSeasonForTimeSkip("summer", option));
      seasonsList.append(this._getSeasonForTimeSkip("autumn", option));
      seasonsList.append(this._getSeasonForTimeSkip("winter", option));

      cyclesButton.on("click", function () {
        cyclesList.toggle();
        seasonsList.toggle(false);
      });

      seasonsButton.on("click", function () {
        cyclesList.toggle(false);
        seasonsList.toggle();
      });

      element.append(
        cyclesButton,
        seasonsButton,
        maximunButton,
        triggerButton,
        cyclesList,
        seasonsList
      );
    } else if (name == "reset") {
      const resetBuildList = this.getOptionHead("reset-build");
      const resetSpaceList = this.getOptionHead("reset-space");
      const resetResourcesList = this._getResourceOptions(true);
      const resetReligionList = this.getOptionHead("reset-religion");
      const resetTimeList = this.getOptionHead("reset-time");

      for (const item in this._host.options.auto.build.items) {
        resetBuildList.append(
          this._getResetOption(item, "build", this._host.options.auto.build.items[item])
        );
      }
      for (const item in this._host.options.auto.space.items) {
        resetSpaceList.append(
          this._getResetOption(item, "space", this._host.options.auto.space.items[item])
        );
      }
      for (const item in this._host.options.auto.unicorn.items) {
        resetReligionList.append(
          this._getResetOption(item, "unicorn", this._host.options.auto.unicorn.items[item])
        );
      }
      for (const item in this._host.options.auto.faith.items) {
        resetReligionList.append(
          this._getResetOption(item, "faith", this._host.options.auto.faith.items[item])
        );
      }
      for (const item in this._host.options.auto.time.items) {
        resetTimeList.append(
          this._getResetOption(item, "time", this._host.options.auto.time.items[item])
        );
      }

      const buildButton = $("<div/>", {
        id: "toggle-reset-build",
        text: this._host.i18n("ui.build"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const spaceButton = $("<div/>", {
        id: "toggle-reset-space",
        text: this._host.i18n("ui.space"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const resourcesButton = $("<div/>", {
        id: "toggle-reset-resources",
        text: this._host.i18n("ui.craft.resources"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const religionButton = $("<div/>", {
        id: "toggle-reset-religion",
        text: this._host.i18n("ui.faith"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const timeButton = $("<div/>", {
        id: "toggle-reset-time",
        text: this._host.i18n("ui.time"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      buildButton.on("click", () => {
        resetBuildList.toggle();
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      spaceButton.on("click", () => {
        resetBuildList.toggle(false);
        resetSpaceList.toggle();
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      resourcesButton.on("click", () => {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle();
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      religionButton.on("click", () => {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle();
        resetTimeList.toggle(false);
      });
      timeButton.on("click", () => {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle();
      });

      element.append(
        buildButton,
        spaceButton,
        resourcesButton,
        religionButton,
        timeButton,
        resetBuildList,
        resetSpaceList,
        resetResourcesList,
        resetReligionList,
        resetTimeList
      );
    } else {
      const triggerButton = $("<div/>", {
        id: "set-" + name + "-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);

      triggerButton.on("click", () => {
        const value = window.prompt(
          this._host.i18n("ui.trigger.set", [option.label]),
          option.subTrigger
        );

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });
      element.append(triggerButton);
    }

    return element;
  }

  private _getCycle(index: number, option: { [key: number]: boolean }): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + index,
      text: cycle.title,
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + index,
      type: "checkbox",
    }).data("option", option);

    if (option[index]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[index] == false) {
        option[index] = true;
        this._host.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] == true) {
        option[index] = false;
        this._host.imessage("time.skip.cycle.disable", [cycle.title]);
      }
      kittenStorage.items[input.attr("id")] = option[index];
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  private _getResetOption(
    name: string,
    type: unknown,
    option: { checkForReset: boolean; label: string }
  ): JQuery<HTMLElement> {
    const element = $("<li/>");
    const elementLabel = option.label;

    const label = $("<label/>", {
      for: "toggle-reset-" + type + "-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-reset-" + type + "-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.checkForReset) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.checkForReset == false) {
        option.checkForReset = true;
        this._host.imessage("status.reset.check.enable", [elementLabel]);
      } else if (!input.is(":checked") && option.checkForReset == true) {
        option.checkForReset = false;
        this._host.imessage("status.reset.check.disable", [elementLabel]);
      }
      kittenStorage.items[input.attr("id")] = option.checkForReset;
      this._host.saveToKittenStorage();
    });

    const minButton = $("<div/>", {
      id: "set-reset-" + type + "-" + name + "-min",
      text: this._host.i18n("ui.min", [option.triggerForReset]),
      title: option.triggerForReset,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    minButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("reset.check.trigger.set", [option.label]),
        option.triggerForReset
      );

      if (value !== null) {
        option.triggerForReset = parseInt(value);
        kittenStorage.items[minButton.attr("id")] = option.triggerForReset;
        this._host.saveToKittenStorage();
        minButton[0].title = option.triggerForReset;
        minButton[0].innerText = this._host.i18n("ui.min", [option.triggerForReset]);
      }
    });

    element.append(input, label, minButton);

    return element;
  }

  private _getSeasonForTimeSkip(
    season: Season,
    option: { [season in Season]: boolean }
  ): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.i18n("$calendar.season." + season));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + season,
      type: "checkbox",
    }).data("option", option);

    if (option[season]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        this._host.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        this._host.imessage("time.skip.season.disable", [iseason]);
      }
      kittenStorage.items[input.attr("id")] = option[season];
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  private _getResourceOptions(forReset = false): JQuery<HTMLElement> {
    const list = $("<ul/>", {
      id: forReset ? "toggle-reset-list-resources" : "toggle-list-resources",
      css: { display: "none", paddingLeft: "20px" },
    });

    const add = $("<div/>", {
      id: "resources-add",
      text: this._host.i18n("resources.add"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        borderBottom: "1px solid rgba(185, 185, 185, 0.7)",
      },
    });

    const clearunused = $("<div/>", {
      id: "resources-clear-unused",
      text: this._host.i18n("resources.clear.unused"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    clearunused.on("click", () => {
      for (const name in this._host.options.auto.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        if (
          (!this._host.options.auto.resources[name as Resource]!.stock &&
            this._host.options.auto.resources[name as Resource]!.consume ==
              this._host.options.consume) ||
          this._host.options.auto.resources[name as Resource]!.consume == undefined
        ) {
          $("#resource-" + name).remove();
        }
      }
    });

    const allresources = $("<ul/>", {
      id: "available-resources-list",
      css: { display: "none", paddingLeft: "20px" },
    });

    add.on("click", () => {
      allresources.toggle();
      allresources.empty();
      allresources.append(this.getAvailableResourceOptions(forReset));
    });

    if (forReset) list.append(add, allresources);
    else list.append(add, clearunused, allresources);

    // Add all the current resources
    for (const [name] of objectEntries(this._host.options.auto.resources)) {
      const res = mustExist(this._host.options.auto.resources[name]);
      if ((forReset && res.checkForReset) || (!forReset && res.enabled))
        list.append(this.addNewResourceOption(name, undefined, forReset));
    }

    return list;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
