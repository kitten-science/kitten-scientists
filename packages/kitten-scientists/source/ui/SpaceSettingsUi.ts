import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { UserScript } from "../UserScript.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { MissionSettingsUi } from "./MissionSettingsUi.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class SpaceSettingsUi extends SettingsSectionUi<SpaceSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _missionsUi: MissionSettingsUi;

  constructor(host: UserScript, settings: SpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listElements = new SettingsList(this._host, {
      children: this._host.game.space.planets.flatMap(planet => [
        new HeaderListItem(this._host, planet.label),
        ...planet.buildings
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(building =>
            this._getBuildOption(
              this.setting.buildings[building.name],
              building.label,
              building.name === planet.buildings.at(-1)?.name,
            ),
          ),
      ]),
      onReset: () => {
        this.setting.load({ buildings: new SpaceSettings().buildings });
        this.refreshUi();
      },
    });
    this.addChild(listElements);

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
