import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { TimeSettings, TimeSettingsItem } from "../settings/TimeSettings.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class TimeSettingsUi extends SettingsSectionUi<TimeSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _fixCryochamber: SettingListItem;
  private readonly _turnOnChronoFurnace: SettingListItem;

  constructor(host: KittenScientists, settings: TimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listBuildings = new SettingsList(this._host, {
      children: [
        new HeaderListItem(this._host, this._host.engine.i18n("$workshop.chronoforge.label")),
        ...this._host.game.time.chronoforgeUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(building =>
            this._getTimeSetting(
              this.setting.buildings[building.name],
              building.label,
              building.name === this._host.game.time.chronoforgeUpgrades.at(-1)?.name,
            ),
          ),
        new HeaderListItem(this._host, this._host.engine.i18n("$science.voidSpace.label")),
        ...this._host.game.time.voidspaceUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(building =>
            this._getTimeSetting(this.setting.buildings[building.name], building.label),
          ),
      ],
    });
    this.addChild(listBuildings);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")));
    this._fixCryochamber = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.fix.cry"),
      this.setting.fixCryochambers,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.fix.cry"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.fix.cry"),
          ]);
        },
      },
    );
    listAddition.addChild(this._fixCryochamber);

    this._turnOnChronoFurnace = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.chronofurnace"),
      this.setting.turnOnChronoFurnace,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.chronofurnace"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.chronofurnace"),
          ]);
        },
      },
    );
    listAddition.addChild(this._turnOnChronoFurnace);
    this.addChild(listAddition);
  }

  private _getTimeSetting(setting: TimeSettingsItem, label: string, delimiter = false) {
    return new SettingMaxListItem(this._host, label, setting, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
    });
  }
}
