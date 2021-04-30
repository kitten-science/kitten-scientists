import { CraftSettings, CraftSettingsItem } from "../options/CraftSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { cwarn } from "../tools/Log";
import { isNil, Maybe, mustExist } from "../tools/Maybe";
import { ResourceCraftable } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class CraftSettingsUi extends SettingsSectionUi<CraftSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: CraftSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private readonly _resourcesButton: JQuery<HTMLElement>;
  private _resourcesList: Maybe<JQuery<HTMLElement>>;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: CraftSettings = host.options.auto.craft) {
    super(host);

    this._options = options;

    const toggleName = "craft";

    const itext = ucfirst(this._host.i18n("ui.craft"));

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
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._options.enabled = true;

        this._host.imessage("status.auto.enable", [itext]);
        //saveToKittenStorage();
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._options.enabled = false;
        this._host.imessage("status.auto.disable", [itext]);
        //saveToKittenStorage();
      }
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: "trigger-" + toggleName,
      text: this._host.i18n("ui.trigger"),
      title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    this._options.$trigger = this._triggerButton;

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toString()
      );

      if (value !== null) {
        this._options.trigger = parseFloat(value);
        //this._host.saveToKittenStorage();
        this._triggerButton[0].title = this._options.trigger.toString();
      }
    });

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

    this._optionButtons = [
      this._getCraftOption(
        "wood",
        this._options.items.wood,
        this._host.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        "beam",
        this._options.items.beam,
        this._host.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        "slab",
        this._options.items.slab,
        this._host.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        "steel",
        this._options.items.steel,
        this._host.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        "plate",
        this._options.items.plate,
        this._host.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        "alloy",
        this._options.items.alloy,
        this._host.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        "concrate",
        this._options.items.concrate,
        this._host.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        "gear",
        this._options.items.gear,
        this._host.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        "scaffold",
        this._options.items.scaffold,
        this._host.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        "ship",
        this._options.items.ship,
        this._host.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        "tanker",
        this._options.items.tanker,
        this._host.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        "parchment",
        this._options.items.parchment,
        this._host.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        "manuscript",
        this._options.items.manuscript,
        this._host.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        "compedium",
        this._options.items.compedium,
        this._host.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        "blueprint",
        this._options.items.blueprint,
        this._host.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        "kerosene",
        this._options.items.kerosene,
        this._host.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        "megalith",
        this._options.items.megalith,
        this._host.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        "eludium",
        this._options.items.eludium,
        this._host.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        "thorium",
        this._options.items.thorium,
        this._host.i18n("$workshop.crafts.thorium.label")
      ),
    ];

    list.append(...this._optionButtons);

    this._resourcesButton = $("<div/>", {
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

    const resourcesList = this._getResourceOptions();

    // When we click the items button, make sure we clear resources
    this._itemsButton.on("click", () => {
      resourcesList.toggle(false);
    });

    this._resourcesButton.on("click", () => {
      list.toggle(false);
      resourcesList.toggle();
    });

    element.append(this._itemsButton);
    element.append(this._resourcesButton);
    element.append(this._triggerButton);
    element.append(list);
    element.append(resourcesList);

    this.element = element;
  }

  private _getCraftOption(
    name: string,
    option: CraftSettingsItem,
    label: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label, delimiter);

    const labelElement = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);
    option.$limited = input;

    /*
    if (option.limited) {
      input.prop("checked", true);
    }
    */

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("craft.limited", [label]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("craft.unlimited", [label]);
      }
      //kittenStorage.items[input.attr("id")] = option.limited;
      //this._host.saveToKittenStorage();
    });

    element.append(input, labelElement);

    return element;
  }

  private _getResourceOptions(): JQuery<HTMLElement> {
    this._resourcesList = $("<ul/>", {
      id: "toggle-list-resources",
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
          (!this._host.options.auto.resources[name as ResourceCraftable]!.stock &&
            this._host.options.auto.resources[name as ResourceCraftable]!.consume ==
              this._host.options.consume) ||
          this._host.options.auto.resources[name as ResourceCraftable]!.consume == undefined
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
      allresources.append(
        this.getAllAvailableResourceOptions(false, res => {
          if (!this._options.resources[res.name]) {
            const option = {
              consume: this._host.options.consume,
              enabled: true,
              stock: 0,
            };
            this._options.resources[res.name] = option;
            mustExist(this._resourcesList).append(
              this.addNewResourceOption(res.name, res.title, option, (_name, _resource) => {
                delete this._options.resources[_name];
              })
            );
          }
        })
      );
    });

    this._resourcesList.append(add, clearunused, allresources);

    // Add all the current resources
    for (const [name, item] of objectEntries(this._host.options.auto.resources)) {
      this._resourcesList.append(
        this.addNewResourceOption(name, name, item, (_name, _resource) => {
          delete this._options.resources[_name];
        })
      );
      //this.setStockValue(name, item.stock);
      //this.setConsumeRate(name, item.consume);
    }

    return this._resourcesList;
  }

  setState(state: CraftSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;
    }
    for (const [name, option] of objectEntries(this._options.resources)) {
      const stateResource = state.resources[name];
      if (isNil(stateResource)) {
        cwarn("Existing resource was missing in state! This is a problem.");
        continue;
      }
      option.consume = stateResource.consume;
      option.enabled = stateResource.enabled;
      option.stock = stateResource.stock;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
      mustExist(option.$limited).prop("checked", option.limited);
    }
    for (const [name, option] of objectEntries(this._options.resources)) {
      mustExist(option.$consume).text(
        this._host.i18n("resources.consume", [mustExist(option.consume).toFixed(2)])
      );
      mustExist(option.$stock).text(
        this._host.i18n("resources.stock", [
          option.stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(option.stock),
        ])
      );
    }
  }
}
