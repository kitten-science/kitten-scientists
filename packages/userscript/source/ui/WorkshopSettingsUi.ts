import { CraftSettingsItem, WorkshopSettings } from "../settings/WorkshopSettings";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingLimitedMaxListItem } from "./components/SettingLimitedMaxListItem";
import { SettingListItem } from "./components/SettingListItem";
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
    this._trigger.element.insertBefore(this.list.element);
    this.children.add(this._trigger);

    this.list.addEventListener("enableAll", () => {
      this._crafts.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.list.addEventListener("disableAll", () => {
      this._crafts.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.list.addEventListener("reset", () => {
      this.setting.load(new WorkshopSettings());
      this.refreshUi();
    });

    this._crafts = [
      this._getCraftOption(
        this.setting.resources.wood,
        this._host.engine.i18n("$workshop.crafts.wood.label")
      ),
      this._getCraftOption(
        this.setting.resources.beam,
        this._host.engine.i18n("$workshop.crafts.beam.label")
      ),
      this._getCraftOption(
        this.setting.resources.slab,
        this._host.engine.i18n("$workshop.crafts.slab.label")
      ),
      this._getCraftOption(
        this.setting.resources.steel,
        this._host.engine.i18n("$workshop.crafts.steel.label")
      ),
      this._getCraftOption(
        this.setting.resources.plate,
        this._host.engine.i18n("$workshop.crafts.plate.label")
      ),
      this._getCraftOption(
        this.setting.resources.alloy,
        this._host.engine.i18n("$workshop.crafts.alloy.label")
      ),
      this._getCraftOption(
        this.setting.resources.concrate,
        this._host.engine.i18n("$workshop.crafts.concrate.label")
      ),
      this._getCraftOption(
        this.setting.resources.gear,
        this._host.engine.i18n("$workshop.crafts.gear.label")
      ),
      this._getCraftOption(
        this.setting.resources.scaffold,
        this._host.engine.i18n("$workshop.crafts.scaffold.label")
      ),
      this._getCraftOption(
        this.setting.resources.ship,
        this._host.engine.i18n("$workshop.crafts.ship.label")
      ),
      this._getCraftOption(
        this.setting.resources.tanker,
        this._host.engine.i18n("$workshop.crafts.tanker.label"),
        true
      ),

      this._getCraftOption(
        this.setting.resources.parchment,
        this._host.engine.i18n("$workshop.crafts.parchment.label")
      ),
      this._getCraftOption(
        this.setting.resources.manuscript,
        this._host.engine.i18n("$workshop.crafts.manuscript.label")
      ),
      this._getCraftOption(
        this.setting.resources.compedium,
        this._host.engine.i18n("$workshop.crafts.compedium.label")
      ),
      this._getCraftOption(
        this.setting.resources.blueprint,
        this._host.engine.i18n("$workshop.crafts.blueprint.label"),
        true
      ),

      this._getCraftOption(
        this.setting.resources.kerosene,
        this._host.engine.i18n("$workshop.crafts.kerosene.label")
      ),
      this._getCraftOption(
        this.setting.resources.megalith,
        this._host.engine.i18n("$workshop.crafts.megalith.label")
      ),
      this._getCraftOption(
        this.setting.resources.eludium,
        this._host.engine.i18n("$workshop.crafts.eludium.label")
      ),
      this._getCraftOption(
        this.setting.resources.thorium,
        this._host.engine.i18n("$workshop.crafts.thorium.label"),
        true
      ),
    ];
    this.addChildren(this._crafts);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    this._upgradeUi = new UpgradeSettingsUi(this._host, this.setting.unlockUpgrades);
    this.addChild(this._upgradeUi);

    this._shipOverride = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.shipOverride"),
      this.setting.shipOverride,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.shipOverride"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
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
