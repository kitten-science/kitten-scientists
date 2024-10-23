import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingTriggerMax } from "../settings/Settings.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { MissionSettingsUi } from "./MissionSettingsUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingTriggerMaxListItem } from "./components/SettingTriggerMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class SpaceSettingsUi extends SettingsPanel<SpaceSettings> {
  private readonly _missionsUi: MissionSettingsUi;

  constructor(host: KittenScientists, settings: SpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    this.addChild(
      new SettingsList(this._host, {
        children: this._host.game.space.planets
          .filter(planet => 0 < planet.buildings.length)
          .flatMap((planet, indexPlanet, arrayPlant) => [
            new HeaderListItem(this._host, planet.label),
            ...planet.buildings
              .filter(item => !isNil(this.setting.buildings[item.name]))
              .map((building, indexBuilding, arrayBuilding) =>
                this._getBuildOption(
                  this.setting.buildings[building.name],
                  building.label,
                  indexPlanet < arrayPlant.length - 1 && indexBuilding === arrayBuilding.length - 1,
                ),
              ),
          ]),
        onReset: () => {
          this.setting.load({ buildings: new SpaceSettings().buildings });
          this.refreshUi();
        },
      }),
    );

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")));

    this._missionsUi = new MissionSettingsUi(this._host, this.setting.unlockMissions);
    listAddition.addChild(this._missionsUi);
    this.addChild(listAddition);
  }

  private _getBuildOption(
    option: SettingTriggerMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingTriggerMaxListItem(this._host, label, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
      upgradeIndicator,
    });
  }
}
