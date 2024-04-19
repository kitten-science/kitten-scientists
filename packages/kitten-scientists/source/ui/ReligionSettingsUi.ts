import { ReligionSettings } from "../settings/ReligionSettings.js";
import { UserScript } from "../UserScript.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  private readonly _trigger: TriggerButton;

  private readonly _unicornBuildings: Array<SettingMaxListItem>;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(host: UserScript, settings: ReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    this._unicornBuildings = [
      this._getBuildOption(
        this.setting.buildings.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label"),
      ),
      this._getBuildOption(
        this.setting.buildings.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label"),
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

        this._getBuildOption(
          this.setting.buildings.marker,
          this._host.engine.i18n("$religion.zu.marker.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.unicornGraveyard,
          this._host.engine.i18n("$religion.zu.unicornGraveyard.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.unicornNecropolis,
          this._host.engine.i18n("$religion.zu.unicornNecropolis.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackPyramid,
          this._host.engine.i18n("$religion.zu.blackPyramid.label"),
          true,
        ),

        new HeaderListItem(
          this._host,
          this._host.engine.i18n("$religion.panel.orderOfTheSun.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.solarchant,
          this._host.engine.i18n("$religion.ru.solarchant.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.scholasticism,
          this._host.engine.i18n("$religion.ru.scholasticism.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.goldenSpire,
          this._host.engine.i18n("$religion.ru.goldenSpire.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.sunAltar,
          this._host.engine.i18n("$religion.ru.sunAltar.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.stainedGlass,
          this._host.engine.i18n("$religion.ru.stainedGlass.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.solarRevolution,
          this._host.engine.i18n("$religion.ru.solarRevolution.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.basilica,
          this._host.engine.i18n("$religion.ru.basilica.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.templars,
          this._host.engine.i18n("$religion.ru.templars.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.apocripha,
          this._host.engine.i18n("$religion.ru.apocripha.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.transcendence,
          this._host.engine.i18n("$religion.ru.transcendence.label"),
          true,
        ),

        new HeaderListItem(
          this._host,
          this._host.engine.i18n("$religion.panel.cryptotheology.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackObelisk,
          this._host.engine.i18n("$religion.tu.blackObelisk.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackNexus,
          this._host.engine.i18n("$religion.tu.blackNexus.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackCore,
          this._host.engine.i18n("$religion.tu.blackCore.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.singularity,
          this._host.engine.i18n("$religion.tu.singularity.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackLibrary,
          this._host.engine.i18n("$religion.tu.blackLibrary.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blackRadiance,
          this._host.engine.i18n("$religion.tu.blackRadiance.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.blazar,
          this._host.engine.i18n("$religion.tu.blazar.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.darkNova,
          this._host.engine.i18n("$religion.tu.darkNova.label"),
        ),
        this._getBuildOption(
          this.setting.buildings.holyGenocide,
          this._host.engine.i18n("$religion.tu.holyGenocide.label"),
        ),
      ],
      onEnableAll: () => this.refreshUi(),
      onDisableAll: () => this.refreshUi(),
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
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.faith.sacrificeUnicorns"),
          this.setting.sacrificeUnicorns,
          {
            behavior: "integer",
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.sacrificeUnicorns"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.sacrificeUnicorns"),
              ]),
          },
        ),
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.faith.sacrificeAlicorns"),
          this.setting.sacrificeAlicorns,
          {
            behavior: "integer",
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.sacrificeAlicorns"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.sacrificeAlicorns"),
              ]),
          },
        ),
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.faith.refineTears"),
          this.setting.refineTears,
          {
            behavior: "integer",
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.refineTears"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.refineTears"),
              ]),
          },
        ),
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.faith.refineTCs"),
          this.setting.refineTimeCrystals,
          {
            behavior: "integer",
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.refineTCs"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.refineTCs"),
              ]),
          },
        ),
        new SettingListItem(
          this._host,
          this._host.engine.i18n("option.faith.transcend"),
          this.setting.transcend,
          {
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.transcend"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.transcend"),
              ]),
          },
        ),
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.faith.adore"),
          this.setting.adore,
          {
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.faith.adore"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.faith.adore"),
              ]),
          },
        ),
        new SettingTriggerListItem(
          this._host,
          this._host.engine.i18n("option.praise"),
          this.setting.autoPraise,
          {
            onCheck: () =>
              this._host.engine.imessage("status.sub.enable", [
                this._host.engine.i18n("option.praise"),
              ]),
            onUnCheck: () =>
              this._host.engine.imessage("status.sub.disable", [
                this._host.engine.i18n("option.praise"),
              ]),
          },
        ),
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
