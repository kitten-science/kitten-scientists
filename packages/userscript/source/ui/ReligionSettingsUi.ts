import { ReligionSettings } from "../options/ReligionSettings";
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
        this.setting.items.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getBuildOption(
        this.setting.items.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getBuildOption(
        this.setting.items.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getBuildOption(
        this.setting.items.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getBuildOption(
        this.setting.items.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getBuildOption(
        this.setting.items.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getBuildOption(
        this.setting.items.sunspire,
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
        this.setting.items.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getBuildOption(
        this.setting.items.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getBuildOption(
        this.setting.items.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getBuildOption(
        this.setting.items.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.orderOfTheSun.label")),
      this._getBuildOption(
        this.setting.items.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getBuildOption(
        this.setting.items.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getBuildOption(
        this.setting.items.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getBuildOption(
        this.setting.items.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getBuildOption(
        this.setting.items.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getBuildOption(
        this.setting.items.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getBuildOption(
        this.setting.items.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getBuildOption(
        this.setting.items.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getBuildOption(
        this.setting.items.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getBuildOption(
        this.setting.items.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      new HeaderListItem(
        this._host,
        this._host.engine.i18n("$religion.panel.cryptotheology.label")
      ),
      this._getBuildOption(
        this.setting.items.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getBuildOption(
        this.setting.items.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getBuildOption(
        this.setting.items.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getBuildOption(
        this.setting.items.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getBuildOption(
        this.setting.items.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getBuildOption(
        this.setting.items.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getBuildOption(
        this.setting.items.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getBuildOption(
        this.setting.items.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getBuildOption(
        this.setting.items.holyGenocide,
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
    for (const building of this._unicornBuildings) {
      building.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
    }
    super.refreshUi();
  }
}
