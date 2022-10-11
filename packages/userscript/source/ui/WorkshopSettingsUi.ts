import { CraftSettingsItem, WorkshopSettings } from "../options/WorkshopSettings";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingLimitedMaxListItem } from "./components/SettingLimitedMaxListItem";
import { SettingListItem } from "./components/SettingListItem";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi";

export class WorkshopSettingsUi extends SettingsSectionUi<WorkshopSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _crafts: Array<SettingListItem>;
  private readonly _upgradeUi: UpgradeSettingsUi;
  private readonly _shipOverride: SettingListItem;

  constructor(host: UserScript, settings: WorkshopSettings) {
    const label = host.engine.i18n("ui.craft");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list);
    this.children.add(this._trigger);

    this._list.addEventListener("enableAll", () => {
      this._crafts.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._crafts.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new WorkshopSettings());
      this.refreshUi();
    });

    this._crafts = [
      this._getCraftOption(
        this.settings.items.wood,
        this._host.engine.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        this.settings.items.beam,
        this._host.engine.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        this.settings.items.slab,
        this._host.engine.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        this.settings.items.steel,
        this._host.engine.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        this.settings.items.plate,
        this._host.engine.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        this.settings.items.alloy,
        this._host.engine.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        this.settings.items.concrate,
        this._host.engine.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        this.settings.items.gear,
        this._host.engine.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        this.settings.items.scaffold,
        this._host.engine.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        this.settings.items.ship,
        this._host.engine.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        this.settings.items.tanker,
        this._host.engine.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        this.settings.items.parchment,
        this._host.engine.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        this.settings.items.manuscript,
        this._host.engine.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        this.settings.items.compedium,
        this._host.engine.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        this.settings.items.blueprint,
        this._host.engine.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        this.settings.items.kerosene,
        this._host.engine.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        this.settings.items.megalith,
        this._host.engine.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        this.settings.items.eludium,
        this._host.engine.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        this.settings.items.thorium,
        this._host.engine.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];
    this.addChildren(this._crafts);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    this._upgradeUi = new UpgradeSettingsUi(this._host, this.settings.unlockUpgrades);
    this.addChild(this._upgradeUi);

    this._shipOverride = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.shipOverride"),
      this.settings.shipOverride,
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
    this.addChild(this._shipOverride);
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
}
