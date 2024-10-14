import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { MissionSettingsUi } from "./MissionSettingsUi.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class SpaceSettingsUi extends AbstractBuildSettingsPanel<SpaceSettings> {
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
}
