import { ReligionSettings } from "../options/ReligionSettings";
import { filterType } from "../tools/Array";
import { objectEntries } from "../tools/Entries";
import { UnicornItemVariant } from "../types";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _buildings: Array<SettingListItem>;

  constructor(host: UserScript, settings: ReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list);
    this.children.add(this._trigger);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ReligionSettings());
      this.refreshUi();
    });

    const uiElements = [
      new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.ziggurat.label")),
      this._getBuildOption(
        this.settings.items.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getBuildOption(
        this.settings.items.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getBuildOption(
        this.settings.items.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getBuildOption(
        this.settings.items.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getBuildOption(
        this.settings.items.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getBuildOption(
        this.settings.items.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getBuildOption(
        this.settings.items.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getBuildOption(
        this.settings.items.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getBuildOption(
        this.settings.items.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getBuildOption(
        this.settings.items.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getBuildOption(
        this.settings.items.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$religion.panel.orderOfTheSun.label")),
      this._getBuildOption(
        this.settings.items.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getBuildOption(
        this.settings.items.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getBuildOption(
        this.settings.items.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getBuildOption(
        this.settings.items.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getBuildOption(
        this.settings.items.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getBuildOption(
        this.settings.items.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getBuildOption(
        this.settings.items.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getBuildOption(
        this.settings.items.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getBuildOption(
        this.settings.items.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getBuildOption(
        this.settings.items.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      new HeaderListItem(
        this._host,
        this._host.engine.i18n("$religion.panel.cryptotheology.label")
      ),
      this._getBuildOption(
        this.settings.items.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getBuildOption(
        this.settings.items.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getBuildOption(
        this.settings.items.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getBuildOption(
        this.settings.items.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getBuildOption(
        this.settings.items.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getBuildOption(
        this.settings.items.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getBuildOption(
        this.settings.items.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getBuildOption(
        this.settings.items.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getBuildOption(
        this.settings.items.holyGenocide,
        this._host.engine.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];
    this._buildings = filterType(uiElements, SettingListItem);
    this.addChildren(uiElements);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    const nodeAdore = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.faith.adore"),
      this.settings.adore,
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
      this.settings.autoPraise,
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

    const nodeBestUnicornBuilding = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.faith.best.unicorn"),
      this.settings.bestUnicornBuilding,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.faith.best.unicorn"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.faith.best.unicorn"),
          ]),
      }
    );

    nodeBestUnicornBuilding.element
      .children("label")
      .prop("title", this._host.engine.i18n("option.faith.best.unicorn.desc"));
    const input = nodeBestUnicornBuilding.element.children("input");
    input.unbind("change");
    const bub = this.settings.bestUnicornBuilding;
    input.on("change", () => {
      if (input.is(":checked") && !bub.enabled) {
        this._host.updateSettings(() => (bub.enabled = true));
        // enable all unicorn buildings
        for (const [unicornName, option] of objectEntries(this.settings.items)) {
          if (
            option.variant !== UnicornItemVariant.UnicornPasture &&
            option.variant !== UnicornItemVariant.Ziggurat
          ) {
            continue;
          }

          // This seems wrong to do here.
          const building = $(`#toggle-${unicornName}`);
          building.prop("checked", true);
          building.trigger("change");
        }
        this._host.engine.imessage("status.sub.enable", [
          this._host.engine.i18n("option.faith.best.unicorn"),
        ]);
      } else if (!input.is(":checked") && bub.enabled) {
        this._host.updateSettings(() => (bub.enabled = false));
        this._host.engine.imessage("status.sub.disable", [
          this._host.engine.i18n("option.faith.best.unicorn"),
        ]);
      }
      //kittenStorage.items[input.attr("id")] = bub.enabled;
      //this._host.saveToKittenStorage();
    });
    this.addChild(nodeBestUnicornBuilding);

    const nodeTranscend = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.faith.transcend"),
      this.settings.transcend,
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

    /* TODO:

      The idea here, appears to be, to disable the "Build best unicorn building"
      option, whenever _any_ unicorn-related building is disabled in the build
      options.
      This should be handled in state management.

    // disable auto best unicorn building when unicorn building was disable
    for (const unicornName in this._host.options.auto.unicorn.items) {
      const ub = list.children().children("#toggle-" + unicornName);
      ub.on("change", event => {
        if (!$(event.target).is(":checked")) {
          const b = $("#toggle-bestUnicornBuilding");
          b.prop("checked", false);
          b.trigger("change");
        }
      });
    }
    */
  }
}
