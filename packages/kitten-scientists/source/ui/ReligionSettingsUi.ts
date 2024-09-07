import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { ReligionOptions, ReligionSettings, UnicornItems } from "../settings/ReligionSettings.js";
import { ZiggurathUpgrade } from "../types/index.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  private readonly _trigger: TriggerButton;

  private readonly _unicornBuildings: Array<SettingMaxListItem>;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(host: KittenScientists, settings: ReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = [
      this._getBuildOption(
        this.setting.buildings.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label"),
      ),
      ...this._host.game.religion.zigguratUpgrades
        .filter(
          item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(zigguratUpgrade =>
          this._getBuildOption(this.setting.buildings[zigguratUpgrade.name], zigguratUpgrade.label),
        ),
    ];
    this._bestUnicornBuilding = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.faith.best.unicorn"),
      this.setting.bestUnicornBuilding,
      {
        delimiter: true,
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.faith.best.unicorn"),
          ]);
          for (const building of this._unicornBuildings) {
            building.setting.enabled = true;
            building.setting.max = -1;
          }
          this.refreshUi();
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.faith.best.unicorn"),
          ]);
          this.refreshUi();
        },
        upgradeIndicator: true,
      },
    );

    const listBuildings = new SettingsList(this._host, {
      children: [
        new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.ziggurat.label")),
        ...this._unicornBuildings,
        this._bestUnicornBuilding,

        ...this._host.game.religion.zigguratUpgrades
          .filter(
            item => !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
          )
          .map(upgrade =>
            this._getBuildOption(
              this.setting.buildings[upgrade.name],
              upgrade.label,
              upgrade.name === this._host.game.religion.zigguratUpgrades.at(-1)?.name,
            ),
          ),

        new HeaderListItem(
          this._host,
          this._host.engine.i18n("$religion.panel.orderOfTheSun.label"),
        ),
        ...this._host.game.religion.religionUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            this._getBuildOption(
              this.setting.buildings[upgrade.name],
              upgrade.label,
              upgrade.name === this._host.game.religion.religionUpgrades.at(-1)?.name,
            ),
          ),

        new HeaderListItem(
          this._host,
          this._host.engine.i18n("$religion.panel.cryptotheology.label"),
        ),
        ...this._host.game.religion.transcendenceUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            this._getBuildOption(
              this.setting.buildings[upgrade.name],
              upgrade.label,
              upgrade.name === this._host.game.religion.transcendenceUpgrades.at(-1)?.name,
            ),
          ),
      ],
      onEnableAll: () => {
        this.refreshUi();
      },
      onDisableAll: () => {
        this.refreshUi();
      },
      onReset: () => {
        const defaults = new ReligionSettings();
        this.setting.load({
          buildings: defaults.buildings,
          bestUnicornBuilding: defaults.bestUnicornBuilding,
        });
        this.refreshUi();
      },
    });

    this.addChild(listBuildings);

    const listAddition = new SettingsList(this._host, {
      children: [
        new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")),
        ...ReligionOptions.map(item => {
          const label = this._host.engine.i18n(`option.faith.${item}`);
          if (item === "transcend") {
            return new SettingListItem(this._host, label, this.setting[item], {
              onCheck: () => {
                this._host.engine.imessage("status.sub.enable", [label]);
              },
              onUnCheck: () => {
                this._host.engine.imessage("status.sub.disable", [label]);
              },
            });
          }
          return new SettingTriggerListItem(this._host, label, this.setting[item], {
            onCheck: () => {
              this._host.engine.imessage("status.sub.enable", [label]);
            },
            onUnCheck: () => {
              this._host.engine.imessage("status.sub.disable", [label]);
            },
          });
        }),
      ],
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this.addChild(listAddition);
  }

  refreshUi() {
    for (const building of this._unicornBuildings) {
      building.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
    }
    super.refreshUi();
  }
}
