import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetSpaceSettings } from "../settings/ResetSpaceSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  constructor(host: KittenScientists, settings: ResetSpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(host, label, settings, {
      icon: Icons.Space,
    });

    this.addChild(
      new SettingsList(this._host, {
        children: this._host.game.space.planets
          .filter(plant => 0 < plant.buildings.length)
          .flatMap((planet, indexPlanet, arrayPlant) => [
            new HeaderListItem(this._host, planet.label),
            ...planet.buildings
              .filter(item => !isNil(this.setting.buildings[item.name]))
              .map((building, indexBuilding, arrayBuilding) =>
                this._getResetOption(
                  this.setting.buildings[building.name],
                  building.label,
                  indexPlanet < arrayPlant.length - 1 && indexBuilding === arrayBuilding.length - 1,
                ),
              ),
          ]),
      }),
    );
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingTriggerLimitListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.reset.check.enable", [i18nName]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.reset.check.disable", [i18nName]);
      },
      upgradeIndicator,
    });
  }
}
