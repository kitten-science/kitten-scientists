import { CraftSettingsItem, WorkshopSettings } from "../options/WorkshopSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingLimitedMaxUi } from "./SettingLimitedMaxUi";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class WorkshopSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;
  readonly mainChild: JQuery<HTMLElement>;

  private readonly _settings: WorkshopSettings;

  constructor(host: UserScript, settings: WorkshopSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "craft";
    const label = ucfirst(this._host.engine.i18n("ui.craft"));
    const list = SettingsListUi.getSettingsList(this._host.engine, toggleName);
    const element = SettingsPanelUi.make(this._host, toggleName, label, this._settings, list);

    // Create "trigger" button in the item.
    this._settings.$trigger = this._makeSectionTriggerButton(toggleName, label, this._settings);

    const buttons = [
      this._getCraftOption(
        "wood",
        this._settings.items.wood,
        this._host.engine.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        "beam",
        this._settings.items.beam,
        this._host.engine.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        "slab",
        this._settings.items.slab,
        this._host.engine.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        "steel",
        this._settings.items.steel,
        this._host.engine.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        "plate",
        this._settings.items.plate,
        this._host.engine.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        "alloy",
        this._settings.items.alloy,
        this._host.engine.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        "concrate",
        this._settings.items.concrate,
        this._host.engine.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        "gear",
        this._settings.items.gear,
        this._host.engine.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        "scaffold",
        this._settings.items.scaffold,
        this._host.engine.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        "ship",
        this._settings.items.ship,
        this._host.engine.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        "tanker",
        this._settings.items.tanker,
        this._host.engine.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        "parchment",
        this._settings.items.parchment,
        this._host.engine.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        "manuscript",
        this._settings.items.manuscript,
        this._host.engine.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        "compedium",
        this._settings.items.compedium,
        this._host.engine.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        "blueprint",
        this._settings.items.blueprint,
        this._host.engine.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        "kerosene",
        this._settings.items.kerosene,
        this._host.engine.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        "megalith",
        this._settings.items.megalith,
        this._host.engine.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        "eludium",
        this._settings.items.eludium,
        this._host.engine.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        "thorium",
        this._settings.items.thorium,
        this._host.engine.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];

    list.append(...buttons);

    const additionOptions = this._getAdditionOptions();
    list.append(additionOptions);

    element.append(this._settings.$trigger);
    element.append(list);

    this.element = element;
    this.mainChild = list;
  }

  private _getCraftOption(
    name: string,
    option: CraftSettingsItem,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    return SettingLimitedMaxUi.make(
      this._host,
      name,
      option,
      label,
      {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
        onLimitedCheck: () => {
          this._host.updateOptions(() => (option.limited = true));
          this._host.engine.imessage("craft.limited", [label]);
        },
        onLimitedUnCheck: () => {
          this._host.updateOptions(() => (option.limited = false));
          this._host.engine.imessage("craft.unlimited", [label]);
        },
      },
      delimiter,
      upgradeIndicator
    );
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradesList = SettingsListUi.getSettingsList(this._host.engine, "upgrades");
    const upgradesElement = SettingsPanelUi.make(
      this._host,
      "upgrades",
      this._host.engine.i18n("ui.upgrade.upgrades"),
      this._settings.unlockUpgrades,
      upgradesList
    );

    const upgradeButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(this._settings.unlockUpgrades.items)) {
      const upgradeLabel = this._host.engine.i18n(`$workshop.${upgradeName}.label`);
      const upgradeButton = SettingUi.make(
        this._host,
        `upgrade-${upgradeName}`,
        upgrade,
        upgradeLabel,
        {
          onCheck: () => this._host.engine.imessage("status.auto.enable", [upgradeLabel]),
          onUnCheck: () => this._host.engine.imessage("status.auto.disable", [upgradeLabel]),
        }
      );

      upgradeButtons.push({ label: upgradeLabel, button: upgradeButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    upgradeButtons.sort((a, b) => a.label.localeCompare(b.label));
    upgradeButtons.forEach(button => upgradesList.append(button.button));

    const shipOverride = SettingUi.make(
      this._host,
      "shipOverride",
      this._settings.shipOverride,
      this._host.engine.i18n("option.shipOverride"),
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.shipOverride"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.shipOverride"),
          ]),
      }
    );

    return [header, upgradesElement, upgradesList, shipOverride];
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
      mustExist(option.$max).text(
        this._host.engine.i18n("ui.max", [this._renderLimit(option.max)])
      );
    }
  }
}
