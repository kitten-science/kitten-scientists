import { CraftSettingsItem, WorkshopSettings } from "../options/WorkshopSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingLimitedMaxListItem } from "./components/SettingLimitedMaxListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi";

export class WorkshopSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _trigger: TriggerButton;
  private readonly _settings: WorkshopSettings;

  private readonly _upgradeUi: UpgradeSettingsUi;

  constructor(host: UserScript, settings: WorkshopSettings) {
    const label = ucfirst(host.engine.i18n("ui.craft"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(panel.list);

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new WorkshopSettings());
      this.refreshUi();
    });

    this._items = [
      this._getCraftOption(
        this._settings.items.wood,
        this._host.engine.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        this._settings.items.beam,
        this._host.engine.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        this._settings.items.slab,
        this._host.engine.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        this._settings.items.steel,
        this._host.engine.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        this._settings.items.plate,
        this._host.engine.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        this._settings.items.alloy,
        this._host.engine.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        this._settings.items.concrate,
        this._host.engine.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        this._settings.items.gear,
        this._host.engine.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        this._settings.items.scaffold,
        this._host.engine.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        this._settings.items.ship,
        this._host.engine.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        this._settings.items.tanker,
        this._host.engine.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        this._settings.items.parchment,
        this._host.engine.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        this._settings.items.manuscript,
        this._host.engine.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        this._settings.items.compedium,
        this._host.engine.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        this._settings.items.blueprint,
        this._host.engine.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        this._settings.items.kerosene,
        this._host.engine.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        this._settings.items.megalith,
        this._host.engine.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        this._settings.items.eludium,
        this._host.engine.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        this._settings.items.thorium,
        this._host.engine.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }

    const additionHeader = new HeaderListItem(this._host, "Additional options");

    this._upgradeUi = new UpgradeSettingsUi(this._host, this._settings.unlockUpgrades);

    const shipOverride = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.shipOverride"),
      this._settings.shipOverride,
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

    panel.list.append(additionHeader.element, this._upgradeUi.element, shipOverride.element);
  }

  private _getCraftOption(
    option: CraftSettingsItem,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingLimitedMaxListItem(
      this._host,
      label,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
        onLimitedCheck: () => this._host.engine.imessage("craft.limited", [label]),
        onLimitedUnCheck: () => this._host.engine.imessage("craft.unlimited", [label]),
      },
      delimiter,
      upgradeIndicator
    );
  }

  setState(state: WorkshopSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    this._upgradeUi.setState(state.unlockUpgrades);

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;
    }

    this._settings.shipOverride.enabled = state.shipOverride.enabled;
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$limited).refreshUi();
      mustExist(option.$max).refreshUi();
    }

    this._upgradeUi.refreshUi();

    mustExist(this._settings.shipOverride.$enabled).refreshUi();
  }
}
