import {
  CraftAdditionSettings,
  CraftSettingsItem,
  WorkshopSettings,
} from "../options/WorkshopSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { Maybe, mustExist } from "../tools/Maybe";
import { ResourceCraftable } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class WorkshopSettingsUi extends SettingsSectionUi<WorkshopSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: WorkshopSettings;

  private _resourcesList: Maybe<JQuery<HTMLElement>>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  private _upgradesExpanded = false;

  constructor(host: UserScript, options: WorkshopSettings = host.options.auto.craft) {
    super(host);

    this._options = options;

    const toggleName = "craft";
    const label = ucfirst(this._host.i18n("ui.craft"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._options.$trigger = this._registerTriggerButton(toggleName, label, this._options);

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
        this._host.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];

    list.append(...this._optionButtons);

    const additionOptions = this.getAdditionOptions(this._options.addition);
    list.append(additionOptions);

    const resourcesButton = $("<div/>", {
      id: "toggle-resource-controls",
      text: "🛠",
      title: this._host.i18n("ui.craft.resources"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });

    const resourcesList = this._getResourceOptions();

    // When we click the items button, make sure we hide resources.
    element.items.on("click", () => {
      resourcesList.toggle(false);
    });

    resourcesButton.on("click", () => {
      list.toggle(false);
      this._itemsExpanded = false;
      element.items.text("+");

      resourcesList.toggle();
    });

    element.panel.append(this._options.$trigger);
    element.panel.append(resourcesButton);
    element.panel.append(list);
    element.panel.append(resourcesList);

    this.element = element.panel;
  }

  private _getCraftOption(
    name: string,
    option: CraftSettingsItem,
    label: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = this._getOption(name, option, label, delimiter, {
      onCheck: () => {
        this._host.updateOptions(() => (option.enabled = true));
        this._host.imessage("status.auto.enable", [label]);
      },
      onUnCheck: () => {
        this._host.updateOptions(() => (option.enabled = false));
        this._host.imessage("status.auto.disable", [label]);
      },
    });

    const labelElement = $("<label/>", {
      for: `toggle-limited-${name}`,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: `toggle-limited-${name}`,
      type: "checkbox",
    }).data("option", option);
    option.$limited = input;

    input.on("change", () => {
      if (input.is(":checked") && option.limited === false) {
        this._host.updateOptions(() => (option.limited = true));
        this._host.imessage("craft.limited", [label]);
      } else if (!input.is(":checked") && option.limited === true) {
        this._host.updateOptions(() => (option.limited = false));
        this._host.imessage("craft.unlimited", [label]);
      }
    });

    element.append(input, labelElement);

    return element;
  }

  private _getResourceOptions(): JQuery<HTMLElement> {
    if (this._resourcesList) {
      return this._resourcesList;
    }

    this._resourcesList = $("<ul/>", {
      id: "toggle-list-resources",
      css: { display: "none", paddingLeft: "20px", paddingTop: "4px" },
    });

    const clearunused = $("<div/>", {
      id: "resources-clear-unused",
      text: this._host.i18n("resources.clear.unused"),
      css: {
        border: "1px solid grey",
        cursor: "pointer",
        float: "right",
        display: "inline-block",
        marginBottom: "4px",
        padding: "1px 2px",
      },
    });

    const add = $("<div/>", {
      id: "resources-add",
      text: this._host.i18n("resources.add"),
      css: {
        border: "1px solid grey",
        cursor: "pointer",
        float: "right",
        display: "inline-block",
        marginBottom: "4px",
        marginRight: "8px",
        padding: "1px 2px",
      },
    });

    clearunused.on("click", () => {
      for (const name in this._host.options.auto.craft.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        const resource = mustExist(
          this._host.options.auto.craft.resources[name as ResourceCraftable]
        );
        if (
          (!resource.stock && resource.consume === this._host.options.consume) ||
          resource.consume === undefined
        ) {
          $(`#resource-${name}`).remove();
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
        this._getAllAvailableResourceOptions(false, res => {
          if (!this._options.resources[res.name]) {
            const option = {
              consume: this._host.options.consume,
              enabled: true,
              stock: 0,
            };
            this._options.resources[res.name] = option;
            mustExist(this._resourcesList).append(
              this._addNewResourceOption(res.name, res.title, option, (_name, _resource) => {
                delete this._options.resources[_name];
              })
            );
          }
        })
      );
    });

    this._resourcesList.append(clearunused, add, allresources);

    // Add all the current resources
    for (const [name, item] of objectEntries(this._host.options.auto.craft.resources)) {
      this._resourcesList.append(
        this._addNewResourceOption(name, name, item, (_name, _resource) => {
          delete this._options.resources[_name];
        })
      );
      //this.setStockValue(name, item.stock);
      //this.setConsumeRate(name, item.consume);
    }

    return this._resourcesList;
  }

  getAdditionOptions(addition: CraftAdditionSettings): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradesButton = this._getOption(
      "upgrades",
      addition.unlockUpgrades,
      this._host.i18n("ui.upgrade.upgrades"),
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (addition.unlockUpgrades.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.upgrades")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (addition.unlockUpgrades.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.upgrades")]);
        },
      }
    );

    const upgradesList = $("<ul/>", {
      id: "items-list-upgrades",
      css: { display: "none", paddingLeft: "20px" },
    });

    const upgradeButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(
      this._options.addition.unlockUpgrades.items
    )) {
      const upgradeLabel = this._host.i18n(`$workshop.${upgradeName}.label`);
      const upgradeButton = this._getOption(
        `upgrade-${upgradeName}`,
        upgrade,
        upgradeLabel,
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (upgrade.enabled = true));
            this._host.imessage("status.auto.enable", [upgradeLabel]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (upgrade.enabled = false));
            this._host.imessage("status.auto.disable", [upgradeLabel]);
          },
        }
      );

      upgradeButtons.push({ label: upgradeLabel, button: upgradeButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    upgradeButtons.sort((a, b) => a.label.localeCompare(b.label));
    upgradeButtons.forEach(button => upgradesList.append(button.button));

    const upgradesItemsButton = this._getItemsToggle("upgrades-show");
    upgradesItemsButton.on("click", () => {
      upgradesList.toggle();

      this._upgradesExpanded = !this._upgradesExpanded;

      upgradesItemsButton.text(this._upgradesExpanded ? "-" : "+");
      upgradesItemsButton.prop(
        "title",
        this._upgradesExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    upgradesButton.append(upgradesItemsButton, upgradesList);

    return [header, upgradesButton];
  }

  getState(): WorkshopSettings {
    return {
      enabled: this._options.enabled,
      trigger: this._options.trigger,
      items: this._options.items,
      resources: this._options.resources,
      addition: this._options.addition,
    };
  }

  setState(state: WorkshopSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    this._options.addition.unlockUpgrades.enabled = state.addition.unlockUpgrades.enabled;
    for (const [name, option] of objectEntries(this._options.addition.unlockUpgrades.items)) {
      option.enabled = state.addition.unlockUpgrades.items[name].enabled;
    }

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;
    }
    // Remove old resource options.
    for (const [name] of objectEntries(this._options.resources)) {
      this._removeResourceOption(name);
    }
    // Add new resource options.
    const resourcesList = this._getResourceOptions();
    for (const [name, option] of objectEntries(state.resources)) {
      resourcesList.append(
        this._addNewResourceOption(name, name, option, (_name, _resource) => {
          delete this._options.resources[_name];
        })
      );
    }
    this._options.resources = state.resources;
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._renderPercentage(this._options.trigger);

    mustExist(this._options.addition.unlockUpgrades.$enabled).prop(
      "checked",
      this._options.addition.unlockUpgrades.enabled
    );
    for (const [, option] of objectEntries(this._options.addition.unlockUpgrades.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
    }

    for (const [, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
      mustExist(option.$limited).prop("checked", option.limited);
    }
    for (const [, option] of objectEntries(this._options.resources)) {
      mustExist(option.$consume).text(
        this._host.i18n("resources.consume", [this._renderConsumeRate(option.consume)])
      );
      mustExist(option.$stock).text(
        this._host.i18n("resources.stock", [this._renderLimit(option.stock)])
      );
    }
  }
}
