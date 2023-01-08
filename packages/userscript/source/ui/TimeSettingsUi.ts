import { TimeSettings, TimeSettingsItem } from "../settings/TimeSettings";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeSettingsUi extends SettingsSectionUi<TimeSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _buildings: Array<SettingListItem>;
  private readonly _fixCryochamber: SettingListItem;
  private readonly _turnOnChronoFurnace: SettingListItem;

  constructor(host: UserScript, settings: TimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listBuildings = new SettingsList(this._host);
    this._buildings = [
      this._getTimeSetting(
        this.setting.buildings.temporalBattery,
        this._host.engine.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.blastFurnace,
        this._host.engine.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.timeBoiler,
        this._host.engine.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.temporalAccelerator,
        this._host.engine.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.temporalImpedance,
        this._host.engine.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.ressourceRetrieval,
        this._host.engine.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getTimeSetting(
        this.setting.buildings.cryochambers,
        this._host.engine.i18n("$time.vsu.cryochambers.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.voidHoover,
        this._host.engine.i18n("$time.vsu.voidHoover.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.voidRift,
        this._host.engine.i18n("$time.vsu.voidRift.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.chronocontrol,
        this._host.engine.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getTimeSetting(
        this.setting.buildings.voidResonator,
        this._host.engine.i18n("$time.vsu.voidResonator.label")
      ),
    ];
    listBuildings.addChildren(this._buildings);
    this.addChild(listBuildings);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, "Additional options"));
    this._fixCryochamber = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.fix.cry"),
      this.setting.fixCryochambers,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.fix.cry"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.fix.cry"),
          ]),
      }
    );
    listAddition.addChild(this._fixCryochamber);

    this._turnOnChronoFurnace = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.chronofurnace"),
      this.setting.turnOnChronoFurnace,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.chronofurnace"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.chronofurnace"),
          ]),
      }
    );
    listAddition.addChild(this._turnOnChronoFurnace);
    this.addChild(listAddition);
  }

  private _getTimeSetting(setting: TimeSettingsItem, label: string, delimiter = false) {
    return new SettingMaxListItem(this._host, label, setting, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }
}
