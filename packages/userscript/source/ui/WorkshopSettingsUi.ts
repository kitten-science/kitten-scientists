import { ResourcesSettingsItem } from "../options/ResourcesSettings";
import { CraftSettingsItem, WorkshopSettings } from "../options/WorkshopSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { Maybe, mustExist } from "../tools/Maybe";
import { ResourceCraftable } from "../types";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";
import { SettingLimitedMaxUi } from "./SettingLimitedMaxUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class WorkshopSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: WorkshopSettings;

  private _resourcesList: Maybe<JQuery<HTMLElement>>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  private _upgradesExpanded = false;

  constructor(host: UserScript, settings: WorkshopSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "craft";
    const label = ucfirst(this._host.i18n("ui.craft"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._settings.$trigger = this._registerTriggerButton(toggleName, label, this._settings);

    this._optionButtons = [
      this._getCraftOption(
        "wood",
        this._settings.items.wood,
        this._host.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        "beam",
        this._settings.items.beam,
        this._host.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        "slab",
        this._settings.items.slab,
        this._host.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        "steel",
        this._settings.items.steel,
        this._host.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        "plate",
        this._settings.items.plate,
        this._host.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        "alloy",
        this._settings.items.alloy,
        this._host.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        "concrate",
        this._settings.items.concrate,
        this._host.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        "gear",
        this._settings.items.gear,
        this._host.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        "scaffold",
        this._settings.items.scaffold,
        this._host.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        "ship",
        this._settings.items.ship,
        this._host.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        "tanker",
        this._settings.items.tanker,
        this._host.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        "parchment",
        this._settings.items.parchment,
        this._host.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        "manuscript",
        this._settings.items.manuscript,
        this._host.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        "compedium",
        this._settings.items.compedium,
        this._host.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        "blueprint",
        this._settings.items.blueprint,
        this._host.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        "kerosene",
        this._settings.items.kerosene,
        this._host.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        "megalith",
        this._settings.items.megalith,
        this._host.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        "eludium",
        this._settings.items.eludium,
        this._host.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        "thorium",
        this._settings.items.thorium,
        this._host.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];

    list.append(...this._optionButtons);

    const additionOptions = this._getAdditionOptions();
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

    element.panel.append(this._settings.$trigger);
    element.panel.append(resourcesButton);
    element.panel.append(list);
    element.panel.append(resourcesList);

    this.element = element.panel;
  }

  private _getCraftOption(
    name: string,
    option: CraftSettingsItem,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    return SettingLimitedMaxUi.make(this._host, name, option, label, delimiter, upgradeIndicator, {
      onLimitedCheck: () => {
        this._host.updateOptions(() => (option.limited = true));
        this._host.imessage("craft.limited", [label]);
      },
      onLimitedUnCheck: () => {
        this._host.updateOptions(() => (option.limited = false));
        this._host.imessage("craft.unlimited", [label]);
      },
    });
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
      for (const name in this._settings.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        const resource = mustExist(this._settings.resources[name as ResourceCraftable]);
        if (
          (!resource.stock && resource.consume === WorkshopManager.DEFAULT_CONSUME_RATE) ||
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
          if (!this._settings.resources[res.name]) {
            const option = new ResourcesSettingsItem(true, WorkshopManager.DEFAULT_CONSUME_RATE, 0);
            this._settings.resources[res.name] = option;
            mustExist(this._resourcesList).append(
              this._addNewResourceOption(res.name, res.title, option, (_name, _resource) => {
                delete this._settings.resources[_name];
              })
            );
          }
        })
      );
    });

    this._resourcesList.append(clearunused, add, allresources);

    // Add all the current resources
    for (const [name, item] of objectEntries(this._settings.resources)) {
      this._resourcesList.append(
        this._addNewResourceOption(name, name, item, (_name, _resource) => {
          delete this._settings.resources[_name];
        })
      );
      //this.setStockValue(name, item.stock);
      //this.setConsumeRate(name, item.consume);
    }

    return this._resourcesList;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradesButton = SettingUi.make(
      this._host,
      "upgrades",
      this._settings.unlockUpgrades,
      this._host.i18n("ui.upgrade.upgrades"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.unlockUpgrades.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.upgrades")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.unlockUpgrades.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.upgrades")]);
        },
      }
    );

    const upgradesList = $("<ul/>", {
      id: "items-list-upgrades",
      css: { display: "none", paddingLeft: "20px" },
    });

    const upgradeButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(this._settings.unlockUpgrades.items)) {
      const upgradeLabel = this._host.i18n(`$workshop.${upgradeName}.label`);
      const upgradeButton = SettingUi.make(
        this._host,
        `upgrade-${upgradeName}`,
        upgrade,
        upgradeLabel,
        false,
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

    const shipOverride = SettingUi.make(
      this._host,
      "shipOverride",
      this._settings.shipOverride,
      this._host.i18n("option.shipOverride"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.shipOverride.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.shipOverride")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.shipOverride.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.shipOverride")]);
        },
      }
    );

    return [header, upgradesButton, shipOverride];
  }

  setState(state: WorkshopSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    this._settings.unlockUpgrades.enabled = state.unlockUpgrades.enabled;
    for (const [name, option] of objectEntries(this._settings.unlockUpgrades.items)) {
      option.enabled = state.unlockUpgrades.items[name].enabled;
    }

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;
    }
    // Remove old resource options.
    for (const [name] of objectEntries(this._settings.resources)) {
      this._removeResourceOption(name);
    }
    // Add new resource options.
    const resourcesList = this._getResourceOptions();
    for (const [name, option] of objectEntries(state.resources)) {
      resourcesList.append(
        this._addNewResourceOption(name, name, option, (_name, _resource) => {
          delete this._settings.resources[_name];
        })
      );
    }
    this._settings.resources = state.resources;
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.trigger
    );

    mustExist(this._settings.unlockUpgrades.$enabled).prop(
      "checked",
      this._settings.unlockUpgrades.enabled
    );
    for (const [, option] of objectEntries(this._settings.unlockUpgrades.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
    }

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
      mustExist(option.$limited).prop("checked", option.limited);
      mustExist(option.$max).text(this._host.i18n("ui.max", [this._renderLimit(option.max)]));
    }
    for (const [, option] of objectEntries(this._settings.resources)) {
      mustExist(option.$consume).text(
        this._host.i18n("resources.consume", [SettingsSectionUi.renderConsumeRate(option.consume)])
      );
      mustExist(option.$stock).text(
        this._host.i18n("resources.stock", [this._renderLimit(option.stock)])
      );
    }
  }
}
