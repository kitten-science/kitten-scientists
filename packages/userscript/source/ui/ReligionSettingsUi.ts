import { ReligionSettings } from "../settings/ReligionSettings";
import { filterType } from "../tools/Array";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _buildings: Array<SettingListItem>;

  private readonly _unicornBuildings: Array<SettingMaxListItem>;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(host: UserScript, settings: ReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list);
    this.children.add(this._trigger);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new ReligionSettings());
      this.refreshUi();
    });

    this._unicornBuildings = [
      this._getBuildOption(
        this.setting.buildings.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getBuildOption(
        this.setting.buildings.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getBuildOption(
        this.setting.buildings.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getBuildOption(
        this.setting.buildings.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getBuildOption(
        this.setting.buildings.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getBuildOption(
        this.setting.buildings.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getBuildOption(
        this.setting.buildings.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label")
      ),
    ];
    this._bestUnicornBuilding = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.faith.best.unicorn"),
      this.setting.bestUnicornBuilding,
      {
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
      },
      true,
      true
    );

    const uiElements = [
      new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.ziggurat.label")),
      ...this._unicornBuildings,
      this._bestUnicornBuilding,

      this._getBuildOption(
        this.setting.buildings.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getBuildOption(
        this.setting.buildings.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getBuildOption(
        this.setting.buildings.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.orderOfTheSun.label")),
      this._getBuildOption(
        this.setting.buildings.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getBuildOption(
        this.setting.buildings.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getBuildOption(
        this.setting.buildings.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getBuildOption(
        this.setting.buildings.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getBuildOption(
        this.setting.buildings.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getBuildOption(
        this.setting.buildings.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getBuildOption(
        this.setting.buildings.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getBuildOption(
        this.setting.buildings.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getBuildOption(
        this.setting.buildings.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getBuildOption(
        this.setting.buildings.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      new HeaderListItem(
        this._host,
        this._host.engine.i18n("$religion.panel.cryptotheology.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getBuildOption(
        this.setting.buildings.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getBuildOption(
        this.setting.buildings.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getBuildOption(
        this.setting.buildings.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getBuildOption(
        this.setting.buildings.holyGenocide,
        this._host.engine.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];
    this._buildings = filterType(uiElements, SettingMaxListItem);
    this.addChildren(uiElements);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    const nodeTranscend = new SettingListItem(
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
      }
    );
    this.addChild(nodeTranscend);

    const nodeAdore = new SettingTriggerListItem(
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
      }
    );
    this.addChild(nodeAdore);

    const nodeAutoPraise = new SettingTriggerListItem(
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
      }
    );
    this.addChild(nodeAutoPraise);
  }

  refreshUi() {
    super.refreshUi();

    for (const building of this._unicornBuildings) {
      building.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
    }
  }
}
