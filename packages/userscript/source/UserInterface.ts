import { ucfirst } from "./tools/Format";
import { Resource, Season } from "./types";
import { UserScript } from "./UserScript";

export class UserInterface {
  private readonly _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  configure(): void {
    const right = $("#rightColumn");

    const addRule = rule => {
      const sheets = document.styleSheets;
      sheets[0].insertRule(rule, 0);
    };

    const defaultSelector = "body[data-ks-style]:not(.scheme_sleek)";

    addRule(
      "body {" + // low priority. make sure it can be covered by the theme
        "font-family: monospace;" +
        "font-size: 12px;" +
        "}"
    );

    addRule(
      defaultSelector +
        " #game {" +
        // + 'font-family: monospace;'
        // + 'font-size: 12px;'
        "min-width: 1300px;" +
        "top: 32px;" +
        "}"
    );

    // addRule(defaultSelector + ' {'
    //     + 'font-family: monospace;'
    //     + 'font-size: 12px;'
    //     + '}');

    addRule(
      defaultSelector +
        " .column {" +
        "min-height: inherit;" +
        "max-width: inherit !important;" +
        "padding: 1%;" +
        "margin: 0;" +
        "overflow-y: auto;" +
        "}"
    );

    addRule(defaultSelector + " #leftColumn {" + "height: 92%;" + "width: 26%;" + "}");

    addRule(
      defaultSelector +
        " #midColumn {" +
        "margin-top: 1% !important;" +
        "height: 90%;" +
        "width: 48%;" +
        "}"
    );

    addRule(
      defaultSelector +
        " #rightColumn {" +
        "overflow-y: auto;" +
        "height: 92%;" +
        "width: 19%;" +
        "}"
    );

    addRule("body #gamePageContainer #game #rightColumn {" + "overflow-y: auto" + "}");

    // addRule(defaultSelector + ' #gameLog .msg {'
    //     + 'display: block;'
    //     + '}');

    addRule(
      defaultSelector +
        " #gameLog {" +
        "overflow-y: hidden !important;" +
        "width: 100% !important;" +
        "padding-top: 5px !important;" +
        "}"
    );

    addRule(defaultSelector + " #resContainer .maxRes {" + "color: #676766;" + "}");

    addRule(
      defaultSelector +
        " #game .btn {" +
        "border-radius: 0px;" +
        "font-family: monospace;" +
        "font-size: 12px !important;" +
        "margin: 0 5px 7px 0;" +
        "width: 290px;" +
        "}"
    );

    addRule(
      defaultSelector +
        " #game .map-viewport {" +
        "height: 340px;" +
        "max-width: 500px;" +
        "overflow: visible;" +
        "}"
    );

    addRule(" #game .map-dashboard {" + "height: 120px;" + "width: 292px;" + "}");

    addRule("#ks-options ul {" + "list-style: none;" + "margin: 0 0 5px;" + "padding: 0;" + "}");

    addRule(
      "#ks-options ul:after {" +
        "clear: both;" +
        'content: " ";' +
        "display: block;" +
        "height: 0;" +
        "}"
    );

    addRule("#ks-options ul li {" + "display: block;" + "float: left;" + "width: 100%;" + "}");

    addRule(
      "#ks-options #toggle-list-resources .stockWarn *," +
        "#ks-options #toggle-reset-list-resources .stockWarn * {" +
        "color: " +
        options.stockwarncolor +
        ";" +
        "}"
    );

    addRule(".right-tab {" + "height: unset !important;" + "}");
  }

  setStockWarning(name: Resource, value: number, forReset = false): void {
    // simplest way to ensure it doesn't stick around too often; always do
    // a remove first then re-add only if needed
    const path = forReset ? "#resource-reset-" + name : "#resource-" + name;
    $(path).removeClass("stockWarn");

    const maxValue = this._host.gamePage.resPool.resources.filter(i => i.name == name)[0].maxValue;
    if ((value > maxValue && !(maxValue === 0)) || value === Infinity)
      $(path).addClass("stockWarn");
  }

  setStockValue(name: Resource, value: number, forReset = false): void {
    let n = Number(value);

    if (isNaN(n) || n < 0) {
      this._host.warning("ignoring non-numeric or invalid stock value " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) this._host.options.auto.resources[name] = {};
    let path;
    if (forReset) {
      path = "#resource-reset-" + name + " #stock-value-" + name;
      n = n < 0 ? Infinity : n;
      this._host.options.auto.resources[name].checkForReset = true;
      this._host.options.auto.resources[name].stockForReset = n;
    } else {
      path = "#resource-" + name + " #stock-value-" + name;
      this._host.options.auto.resources[name].enabled = true;
      this._host.options.auto.resources[name].stock = n;
    }
    $(path).text(
      this._host.i18n("resources.stock", [
        n === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(n),
      ])
    );

    this.setStockWarning(name, n, forReset);
  }

  setConsumeRate(name: Resource, value: number): void {
    const n = parseFloat(value);

    if (isNaN(n) || n < 0.0 || n > 1.0) {
      this._host.warning("ignoring non-numeric or invalid consume rate " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) this._host.options.auto.resources[name] = {};
    this._host.options.auto.resources[name].consume = n;
    $("#consume-rate-" + name).text(this._host.i18n("resources.consume", [n.toFixed(2)]));
  }

  removeResourceControl(name: Resource, forReset = false): void {
    const opt = this._host.options.auto.resources[name];
    if (forReset) opt.checkForReset = false;
    else opt.enabled = false;

    if (!opt.enabled && !opt.checkForReset) delete this._host.options.auto.resources[name];
  }

  addNewResourceOption(name: Resource, title: string, forReset = false): unknown {
    title = title || this._host.gamePage.resPool.get(name).title || ucfirst(name);
    const res = this._host.options.auto.resources[name];
    let stock;
    if (forReset && res && res.stockForReset) stock = res.stockForReset;
    else if (!forReset && res && res.stock) stock = res.stock;
    else stock = 0;
    const consume = res && res.consume != undefined ? res.consume : this._host.options.consume;

    const container = $("<div/>", {
      id: (forReset ? "resource-reset-" : "resource-") + name,
      css: { display: "inline-block", width: "100%" },
    });

    const label = $("<div/>", {
      id: "resource-label-" + name,
      text: title,
      css: { display: "inline-block", width: "95px" },
    });

    const stockElement = $("<div/>", {
      id: "stock-value-" + name,
      text: this._host.i18n("resources.stock", [
        stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stock),
      ]),
      css: { cursor: "pointer", display: "inline-block", width: "80px" },
    });

    const consumeElement = $("<div/>", {
      id: "consume-rate-" + name,
      text: this._host.i18n("resources.consume", [consume.toFixed(2)]),
      css: { cursor: "pointer", display: "inline-block" },
    });

    const del = $("<div/>", {
      id: "resource-delete-" + name,
      text: this._host.i18n("resources.del"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    if (forReset) container.append(label, stockElement, del);
    else container.append(label, stockElement, consumeElement, del);

    // once created, set color if relevant
    if (res != undefined && res.stock != undefined) this.setStockWarning(name, res.stock);

    (function (stock, forReset) {
      stock.on("click", function () {
        const value = window.prompt(i18n("resources.stock.set", [title]));
        if (value !== null) {
          setStockValue(name, value, forReset);
          saveToKittenStorage();
        }
      });
    })(stock, forReset);

    consume.on("click", function () {
      const value = window.prompt(i18n("resources.consume.set", [title]));
      if (value !== null) {
        setConsumeRate(name, value);
        saveToKittenStorage();
      }
    });

    (function (del, forReset) {
      del.on("click", function () {
        if (window.confirm(i18n("resources.del.confirm", [title]))) {
          container.remove();
          removeResourceControl(name, forReset);
          saveToKittenStorage();
        }
      });
    })(del, forReset);

    return container;
  }

  getAvailableResourceOptions(forReset: boolean): unknown {
    const items = [];
    const idPrefix = forReset ? "#resource-reset-" : "#resource-";

    for (const i in this._host.gamePage.resPool.resources) {
      const res = this._host.gamePage.resPool.resources[i];

      // Show only new resources that we don't have in the list and that are
      // visible. This helps cut down on total size.
      if (res.name && $(idPrefix + res.name).length === 0) {
        const item = $("<div/>", {
          id: "resource-add-" + res.name,
          text: ucfirst(res.title ? res.title : res.name),
          css: { cursor: "pointer", textShadow: "3px 3px 4px gray" },
        });

        // Wrapper function needed to make closure work
        (function (res, item, forReset) {
          item.on("click", function () {
            item.remove();
            if (!options.auto.resources[res.name]) options.auto.resources[res.name] = {};
            if (forReset) {
              options.auto.resources[res.name].checkForReset = true;
              options.auto.resources[res.name].stockForReset = Infinity;
              $("#toggle-reset-list-resources").append(
                addNewResourceOption(res.name, res.title, forReset)
              );
            } else {
              options.auto.resources[res.name].enabled = true;
              options.auto.resources[res.name].stock = 0;
              options.auto.resources[res.name].consume = options.consume;
              $("#toggle-list-resources").append(
                addNewResourceOption(res.name, res.title, forReset)
              );
            }
            saveToKittenStorage();
          });
        })(res, item, forReset);

        items.push(item);
      }
    }

    return items;
  }

  getResourceOptions(forReset = false): unknown {
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

    clearunused.on("click", function () {
      for (const name in options.auto.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        if (
          (!options.auto.resources[name].stock &&
            options.auto.resources[name].consume == options.consume) ||
          options.auto.resources[name].consume == undefined
        ) {
          $("#resource-" + name).remove();
        }
      }
    });

    const allresources = $("<ul/>", {
      id: "available-resources-list",
      css: { display: "none", paddingLeft: "20px" },
    });

    (function (add, forReset) {
      add.on("click", function () {
        allresources.toggle();
        allresources.empty();
        allresources.append(getAvailableResourceOptions(forReset));
      });
    })(add, forReset);

    if (forReset) list.append(add, allresources);
    else list.append(add, clearunused, allresources);

    // Add all the current resources
    for (const name in options.auto.resources) {
      const res = options.auto.resources[name];
      if ((forReset && res.checkForReset) || (!forReset && res.enabled))
        list.append(addNewResourceOption(name, undefined, forReset));
    }

    return list;
  }

  getOptionHead(toggleName: string): unknown {
    const list = $("<ul/>", {
      id: "items-list-" + toggleName,
      css: { display: "none", paddingLeft: "20px" },
    });

    const disableall = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.disable.all"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        marginRight: "8px",
      },
    });

    disableall.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = list.children().children(":checkbox");
      items.prop("checked", false);
      items.change();
      list.children().children(":checkbox").change();
    });

    list.append(disableall);

    const enableall = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.enable.all"),
      css: { cursor: "pointer", display: "inline-block", textShadow: "3px 3px 4px gray" },
    });

    enableall.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = list.children().children(":checkbox");
      items.prop("checked", true);
      items.change();
      list.children().children(":checkbox").change();
    });

    list.append(enableall);
    return list;
  }

  getAdditionOptions(): unknown {
    const toggleName = "faith-addition";
    const list = this.getOptionHead(toggleName);

    const addi = this._host.options.auto.faith.addition;
    for (const itemName in addi) {
      node = this.getOption(itemName, addi[itemName]);

      if (itemName == "bestUnicornBuilding") {
        node.children("label").prop("title", this._host.i18n("option.faith.best.unicorn.desc"));
        input = node.children("input");
        input.unbind("change");
        var bub = addi.bestUnicornBuilding;
        input.on("change", function () {
          if (input.is(":checked") && !bub.enabled) {
            bub.enabled = true;
            // enable all unicorn buildings
            for (const unicornName in options.auto.unicorn.items) {
              const building = $("#toggle-" + unicornName);
              building.prop("checked", true);
              building.trigger("change");
            }
            imessage("status.sub.enable", [i18n("option.faith.best.unicorn")]);
          } else if (!input.is(":checked") && bub.enabled) {
            bub.enabled = false;
            imessage("status.sub.disable", [i18n("option.faith.best.unicorn")]);
          }
          kittenStorage.items[input.attr("id")] = bub.enabled;
          saveToKittenStorage();
        });
      }

      if (addi[itemName].subTrigger !== undefined) {
        const triggerButton = $("<div/>", {
          id: "set-" + itemName + "-subTrigger",
          text: this._host.i18n("ui.trigger"),
          title: addi[itemName].subTrigger,
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        }).data("option", addi[itemName]);

        (function (itemName, triggerButton) {
          if (itemName == "adore") {
            triggerButton.on("click", function () {
              let value;
              value = window.prompt(i18n("adore.trigger.set"), addi[itemName].subTrigger);

              if (value !== null) {
                addi[itemName].subTrigger = parseFloat(value);
                kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
                saveToKittenStorage();
                triggerButton[0].title = addi[itemName].subTrigger;
              }
            });
          } else if (itemName == "autoPraise") {
            triggerButton.on("click", function () {
              let value;
              value = window.prompt(
                i18n("ui.trigger.set", [i18n("option.praise")]),
                addi[itemName].subTrigger
              );

              if (value !== null) {
                addi[itemName].subTrigger = parseFloat(value);
                kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
                saveToKittenStorage();
                triggerButton[0].title = addi[itemName].subTrigger;
              }
            });
          }
        })(itemName, triggerButton);
        node.append(triggerButton);
      }

      list.append(node);
    }

    return list;
  }

  getToggle(toggleName: string): unknown {
    const itext = ucfirst(this._host.i18n("ui." + toggleName));

    const auto = this._host.options.auto[toggleName];
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    if (auto.enabled) {
      input.prop("checked", true);
    }

    // engine needs a custom toggle
    if (toggleName !== "engine") {
      input.on("change", function () {
        if (input.is(":checked") && auto.enabled == false) {
          auto.enabled = true;
          if (toggleName === "filter" || toggleName === "options") {
            imessage("status.sub.enable", [itext]);
          } else {
            imessage("status.auto.enable", [itext]);
          }
          saveToKittenStorage();
        } else if (!input.is(":checked") && auto.enabled == true) {
          auto.enabled = false;
          if (toggleName === "filter" || toggleName === "options") {
            imessage("status.sub.disable", [itext]);
          } else {
            imessage("status.auto.disable", [itext]);
          }
          saveToKittenStorage();
        }
      });
    }

    element.append(input, label);

    if (auto.items) {
      // Add a border on the element
      element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

      var toggle = $("<div/>", {
        css: { display: "inline-block", float: "right" },
      });

      const button = $("<div/>", {
        id: "toggle-items-" + toggleName,
        text: i18n("ui.items"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      element.append(button);

      var list = getOptionHead(toggleName);

      // merge unicorn to faith
      if (toggleName == "faith") {
        for (const itemName in options.auto.unicorn.items) {
          list.append(getOption(itemName, options.auto.unicorn.items[itemName]));
        }
      }

      // fill out list with toggle items
      for (const itemName in auto.items) {
        switch (toggleName) {
          case "trade":
            list.append(getTradeOption(itemName, auto.items[itemName]));
            break;
          case "craft":
            list.append(getCraftOption(itemName, auto.items[itemName]));
            break;
          case "timeCtrl":
            list.append(getTimeCtrlOption(itemName, auto.items[itemName]));
            break;
          case "options":
            list.append(getOptionsOption(itemName, auto.items[itemName]));
            break;
          case "upgrade":
            list.append(getOption(itemName, auto.items[itemName], i18n("ui.upgrade." + itemName)));
            break;
          case "distribute":
            list.append(getDistributeOption(itemName, auto.items[itemName]));
            break;
          case "build":
          case "space":
            list.append(getLimitedOption(itemName, auto.items[itemName]));
            break;
          default:
            list.append(getOption(itemName, auto.items[itemName]));
            break;
        }
      }

      button.on("click", function () {
        list.toggle();
      });

      // Add resource controls for crafting, sort of a hack
      if (toggleName === "craft") {
        const resources = $("<div/>", {
          id: "toggle-resource-controls",
          text: this._host.i18n("ui.craft.resources"),
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        });

        const resourcesList = this.getResourceOptions();

        // When we click the items button, make sure we clear resources
        button.on("click", function () {
          resourcesList.toggle(false);
        });

        resources.on("click", function () {
          list.toggle(false);
          resourcesList.toggle();
        });

        element.append(resources);
      }

      // Add additional controls for faith, sort of a hack again
      if (toggleName === "faith") {
        const addition = $("<div/>", {
          id: "toggle-addition-controls",
          text: this._host.i18n("ui.faith.addtion"),
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        });

        const additionList = this.getAdditionOptions();

        button.on("click", function () {
          additionList.toggle(false);
        });

        addition.on("click", function () {
          list.toggle(false);
          additionList.toggle();
        });

        element.append(addition);

        // disable auto best unicorn building when unicorn building was disable
        for (const unicornName in options.auto.unicorn.items) {
          const ub = list.children().children("#toggle-" + unicornName);
          ub.on("change", function () {
            if (!$(event.target).is(":checked")) {
              const b = $("#toggle-bestUnicornBuilding");
              b.prop("checked", false);
              b.trigger("change");
            }
          });
        }
      }
    }

    if (auto.trigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: "trigger-" + toggleName,
        text: this._host.i18n("ui.trigger"),
        title: auto.trigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      triggerButton.on("click", function () {
        let value;
        value = window.prompt(i18n("ui.trigger.set", [itext]), auto.trigger);

        if (value !== null) {
          auto.trigger = parseFloat(value);
          saveToKittenStorage();
          triggerButton[0].title = auto.trigger;
        }
      });

      element.append(triggerButton);
    }

    if (toggleName === "craft") {
      element.append(resourcesList);
    } else if (toggleName === "faith") {
      element.append(additionList);
    }

    if (auto.items) {
      element.append(toggle, list);
    }

    return element;
  }

  getTradeOption(name: string, option: unknown): unknown {
    const iname = ucfirst(this._host.i18n("$trade.race." + name));

    const element = this.getOption(name, option, iname);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Trading
    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        imessage("trade.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        imessage("trade.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      saveToKittenStorage();
    });

    element.append(input, label);
    //Limited Trading End

    const button = $("<div/>", {
      id: "toggle-seasons-" + name,
      text: i18n("trade.seasons"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    const list = $("<ul/>", {
      id: "seasons-list-" + name,
      css: { display: "none", paddingLeft: "20px" },
    });

    // fill out the list with seasons
    list.append(this.getSeason(name, "spring", option));
    list.append(this.getSeason(name, "summer", option));
    list.append(this.getSeason(name, "autumn", option));
    list.append(this.getSeason(name, "winter", option));

    button.on("click", function () {
      list.toggle();
    });

    element.append(button, list);

    return element;
  }

  getSeason(name: string, season: Season, option: unknown): unknown {
    const iname = ucfirst(this._host.i18n("$trade.race." + name));
    const iseason = ucfirst(this._host.i18n("$calendar.season." + season));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-" + name + "-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-" + name + "-" + season,
      type: "checkbox",
    }).data("option", option);

    if (option[season]) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        imessage("trade.season.disable", [iname, iseason]);
      }
      kittenStorage.items[input.attr("id")] = option[season];
      saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getSeasonForTimeSkip(season: Season, option: unknown): unknown {
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

    input.on("change", function () {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        imessage("time.skip.season.disable", [iseason]);
      }
      kittenStorage.items[input.attr("id")] = option[season];
      saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getOption(name: string, option: unknown, iname: string): unknown {
    const element = $("<li/>");
    const elementLabel = iname || option.label || ucfirst(name);

    const label = $("<label/>", {
      for: "toggle-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.enabled) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option.enabled == false) {
        option.enabled = true;
        if (option.filter) {
          imessage("filter.enable", [elementLabel]);
        } else if (option.misc) {
          imessage("status.sub.enable", [elementLabel]);
        } else {
          imessage("status.auto.enable", [elementLabel]);
        }
      } else if (!input.is(":checked") && option.enabled == true) {
        option.enabled = false;
        if (option.filter) {
          imessage("filter.disable", [elementLabel]);
        } else if (option.misc) {
          imessage("status.sub.disable", [elementLabel]);
        } else {
          imessage("status.auto.disable", [elementLabel]);
        }
      }
      kittenStorage.items[input.attr("id")] = option.enabled;
      saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getLimitedOption(name: string, option: unknown, iname: string): unknown {
    const element = $("<li/>");
    const elementLabel = iname || option.label || ucfirst(name);

    const label = $("<label/>", {
      for: "toggle-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.enabled) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option.enabled == false) {
        option.enabled = true;
        if (option.filter) {
          imessage("filter.enable", [elementLabel]);
        } else if (option.misc) {
          imessage("status.sub.enable", [elementLabel]);
        } else {
          imessage("status.auto.enable", [elementLabel]);
        }
      } else if (!input.is(":checked") && option.enabled == true) {
        option.enabled = false;
        if (option.filter) {
          imessage("filter.disable", [elementLabel]);
        } else if (option.misc) {
          imessage("status.sub.disable", [elementLabel]);
        } else {
          imessage("status.auto.disable", [elementLabel]);
        }
      }
      kittenStorage.items[input.attr("id")] = option.enabled;
      saveToKittenStorage();
    });

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: i18n("ui.max", [option.max]),
      title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    maxButton.on("click", function () {
      let value;
      value = window.prompt(i18n("ui.max.set", [option.label]), option.max);

      if (value !== null) {
        option.max = parseInt(value);
        kittenStorage.items[maxButton.attr("id")] = option.max;
        saveToKittenStorage();
        maxButton[0].title = option.max;
        maxButton[0].innerText = i18n("ui.max", [option.max]);
      }
    });

    element.append(input, label, maxButton);

    return element;
  }

  getCraftOption(name: string, option: unknown): unknown {
    const iname = ucfirst(i18n("$resources." + name + ".title"));

    const element = getOption(name, option, iname);

    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        imessage("craft.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        imessage("craft.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getCycle(index: number, option: unknown): unknown {
    const cycle = game.calendar.cycles[index];

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

    input.on("change", function () {
      if (input.is(":checked") && option[index] == false) {
        option[index] = true;
        imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] == true) {
        option[index] = false;
        imessage("time.skip.cycle.disable", [cycle.title]);
      }
      kittenStorage.items[input.attr("id")] = option[index];
      saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getResetOption(name: string, type: unknown, option: unknown): void {
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

    input.on("change", function () {
      if (input.is(":checked") && option.checkForReset == false) {
        option.checkForReset = true;
        imessage("status.reset.check.enable", [elementLabel]);
      } else if (!input.is(":checked") && option.checkForReset == true) {
        option.checkForReset = false;
        imessage("status.reset.check.disable", [elementLabel]);
      }
      kittenStorage.items[input.attr("id")] = option.checkForReset;
      saveToKittenStorage();
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

    minButton.on("click", function () {
      let value;
      value = window.prompt(
        i18n("reset.check.trigger.set", [option.label]),
        option.triggerForReset
      );

      if (value !== null) {
        option.triggerForReset = parseInt(value);
        kittenStorage.items[minButton.attr("id")] = option.triggerForReset;
        saveToKittenStorage();
        minButton[0].title = option.triggerForReset;
        minButton[0].innerText = i18n("ui.min", [option.triggerForReset]);
      }
    });

    element.append(input, label, minButton);

    return element;
  }

  getTimeCtrlOption(name: string, option: unknown): unknown {
    const element = this.getOption(name, option);

    if (name == "timeSkip") {
      var triggerButton = $("<div/>", {
        id: "set-timeSkip-subTrigger",
        text: i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      triggerButton.on("click", function () {
        let value;
        value = window.prompt(i18n("time.skip.trigger.set", []), option.subTrigger);

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      const maximunButton = $("<div/>", {
        id: "set-timeSkip-maximum",
        text: i18n("ui.maximum"),
        title: option.max,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      maximunButton.on("click", function () {
        let value;
        value = window.prompt(i18n("ui.max.set", [i18n("option.time.skip")]), option.maximum);

        if (value !== null) {
          option.maximum = parseFloat(value);
          kittenStorage.items[maximunButton.attr("id")] = option.maximum;
          saveToKittenStorage();
          maximunButton[0].title = option.maximum;
        }
      });

      const cyclesButton = $("<div/>", {
        id: "toggle-cycle-" + name,
        text: i18n("ui.cycles"),
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

      for (const i in game.calendar.cycles) cyclesList.append(getCycle(i, option));

      const seasonsButton = $("<div/>", {
        id: "toggle-seasons-" + name,
        text: i18n("trade.seasons"),
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
      seasonsList.append(getSeasonForTimeSkip("spring", option));
      seasonsList.append(getSeasonForTimeSkip("summer", option));
      seasonsList.append(getSeasonForTimeSkip("autumn", option));
      seasonsList.append(getSeasonForTimeSkip("winter", option));

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
      const resetBuildList = getOptionHead("reset-build");
      const resetSpaceList = getOptionHead("reset-space");
      const resetResourcesList = getResourceOptions(true);
      const resetReligionList = getOptionHead("reset-religion");
      const resetTimeList = getOptionHead("reset-time");

      for (var item in options.auto.build.items)
        resetBuildList.append(getResetOption(item, "build", options.auto.build.items[item]));
      for (var item in options.auto.space.items)
        resetSpaceList.append(getResetOption(item, "space", options.auto.space.items[item]));
      for (var item in options.auto.unicorn.items)
        resetReligionList.append(getResetOption(item, "unicorn", options.auto.unicorn.items[item]));
      for (var item in options.auto.faith.items)
        resetReligionList.append(getResetOption(item, "faith", options.auto.faith.items[item]));
      for (var item in options.auto.time.items)
        resetTimeList.append(getResetOption(item, "time", options.auto.time.items[item]));

      const buildButton = $("<div/>", {
        id: "toggle-reset-build",
        text: i18n("ui.build"),
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
        text: i18n("ui.space"),
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
        text: i18n("ui.craft.resources"),
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
        text: i18n("ui.faith"),
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
        text: i18n("ui.time"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      buildButton.on("click", function () {
        resetBuildList.toggle();
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      spaceButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle();
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      resourcesButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle();
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      religionButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle();
        resetTimeList.toggle(false);
      });
      timeButton.on("click", function () {
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
      var triggerButton = $("<div/>", {
        id: "set-" + name + "-subTrigger",
        text: i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);

      triggerButton.on("click", function () {
        let value;
        value = window.prompt(i18n("ui.trigger.set", [option.label]), option.subTrigger);

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });
      element.append(triggerButton);
    }

    return element;
  }

  getOptionsOption(name: string, option: unknown): unknown {
    const element = this.getOption(name, option);

    // hack for style.
    // If there are more UI options, split it to "getUIOption"
    if (name == "style") {
      const input = element.children("input");
      input.unbind("change");
      input.on("change", function () {
        option.enabled = input.prop("checked");
        kittenStorage.items[input.attr("id")] = option.enabled;
        saveToKittenStorage();
        if (option.enabled) {
          document.body.setAttribute("data-ks-style", "");
        } else {
          document.body.removeAttribute("data-ks-style");
        }
      });
    }

    if (option.subTrigger !== undefined) {
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

      triggerButton.on("click", function () {
        let value;
        if (name == "crypto") {
          value = window.prompt(i18n("ui.trigger.crypto.set", [option.label]), option.subTrigger);
        } else {
          value = window.prompt(i18n("ui.trigger.set", [option.label]), option.subTrigger);
        }

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      element.append(triggerButton);
    }

    return element;
  }

  getDistributeOption(name:string, option:unknown):unknown {
    const iname = ucfirst(this._host.i18n("$village.job." + name));

    const element = this.getOption(name, option, iname);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Distribution
    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", function () {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        imessage("distribute.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        imessage("distribute.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      saveToKittenStorage();
    });

    element.append(input, label);

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: i18n("ui.max", [option.max]),
      title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    (function (iname) {
      maxButton.on("click", function () {
        let value;
        value = window.prompt(i18n("ui.max.set", [iname]), option.max);

        if (value !== null) {
          option.max = parseInt(value);
          kittenStorage.items[maxButton.attr("id")] = option.max;
          saveToKittenStorage();
          maxButton[0].title = option.max;
          maxButton[0].innerText = i18n("ui.max", [option.max]);
        }
      });
    })(iname);

    element.append(maxButton);

    return element;
  }
}
