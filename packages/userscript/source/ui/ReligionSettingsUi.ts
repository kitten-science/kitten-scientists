import { ReligionSettings } from "../options/ReligionSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UnicornItemVariant } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: ReligionSettings;

  constructor(host: UserScript, settings: ReligionSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "faith";
    const label = ucfirst(this._host.i18n("ui.faith"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._settings.$trigger = this._registerTriggerButton(toggleName, label, this._settings);

    const optionButtons = [
      this._getHeader(this._host.i18n("$religion.panel.ziggurat.label")),
      this._getBuildOption(
        "unicornPasture",
        this._settings.items.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this._getBuildOption(
        "unicornTomb",
        this._settings.items.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getBuildOption(
        "ivoryTower",
        this._settings.items.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getBuildOption(
        "ivoryCitadel",
        this._settings.items.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getBuildOption(
        "skyPalace",
        this._settings.items.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this._getBuildOption(
        "unicornUtopia",
        this._settings.items.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getBuildOption(
        "sunspire",
        this._settings.items.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getBuildOption(
        "marker",
        this._settings.items.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this._getBuildOption(
        "unicornGraveyard",
        this._settings.items.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getBuildOption(
        "unicornNecropolis",
        this._settings.items.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getBuildOption(
        "blackPyramid",
        this._settings.items.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.orderOfTheSun.label")),
      this._getBuildOption(
        "solarchant",
        this._settings.items.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this._getBuildOption(
        "scholasticism",
        this._settings.items.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this._getBuildOption(
        "goldenSpire",
        this._settings.items.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getBuildOption(
        "sunAltar",
        this._settings.items.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this._getBuildOption(
        "stainedGlass",
        this._settings.items.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getBuildOption(
        "solarRevolution",
        this._settings.items.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getBuildOption(
        "basilica",
        this._settings.items.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this._getBuildOption(
        "templars",
        this._settings.items.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this._getBuildOption(
        "apocripha",
        this._settings.items.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this._getBuildOption(
        "transcendence",
        this._settings.items.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.cryptotheology.label")),
      this._getBuildOption(
        "blackObelisk",
        this._settings.items.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getBuildOption(
        "blackNexus",
        this._settings.items.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this._getBuildOption(
        "blackCore",
        this._settings.items.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this._getBuildOption(
        "singularity",
        this._settings.items.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this._getBuildOption(
        "blackLibrary",
        this._settings.items.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getBuildOption(
        "blackRadiance",
        this._settings.items.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getBuildOption(
        "blazar",
        this._settings.items.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this._getBuildOption(
        "darkNova",
        this._settings.items.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this._getBuildOption(
        "holyGenocide",
        this._settings.items.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];

    list.append(...optionButtons);

    const additionOptions = this.getAdditionOptions();

    element.panel.append(this._settings.$trigger);
    element.panel.append(list);
    list.append(additionOptions);

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

    this.element = element.panel;
  }

  getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const nodeHeader = this._getHeader("Additional options");

    const nodeAdore = this._getOptionWithTrigger(
      "adore",
      this._settings.adore,
      this._host.i18n("option.faith.adore"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.adore.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.adore")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.adore.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.adore")]);
        },
      }
    );

    const nodeAutoPraise = this._getOptionWithTrigger(
      "autoPraise",
      this._settings.autoPraise,
      this._host.i18n("option.praise"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.autoPraise.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.praise")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.autoPraise.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.praise")]);
        },
      }
    );

    const nodeBestUnicornBuilding = this._getOption(
      "bestUnicornBuilding",
      this._settings.bestUnicornBuilding,
      this._host.i18n("option.faith.best.unicorn"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.bestUnicornBuilding.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.best.unicorn")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.bestUnicornBuilding.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.best.unicorn")]);
        },
      }
    );

    nodeBestUnicornBuilding
      .children("label")
      .prop("title", this._host.i18n("option.faith.best.unicorn.desc"));
    const input = nodeBestUnicornBuilding.children("input");
    input.unbind("change");
    const bub = this._settings.bestUnicornBuilding;
    input.on("change", () => {
      if (input.is(":checked") && !bub.enabled) {
        this._host.updateOptions(() => (bub.enabled = true));
        // enable all unicorn buildings
        for (const [unicornName, option] of objectEntries(this._settings.items)) {
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
        this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.best.unicorn")]);
      } else if (!input.is(":checked") && bub.enabled) {
        this._host.updateOptions(() => (bub.enabled = false));
        this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.best.unicorn")]);
      }
      //kittenStorage.items[input.attr("id")] = bub.enabled;
      //this._host.saveToKittenStorage();
    });

    const nodeTranscend = this._getOption(
      "transcend",
      this._settings.transcend,
      this._host.i18n("option.faith.transcend"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.transcend.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.transcend")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.transcend.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.transcend")]);
        },
      }
    );

    return [nodeHeader, nodeBestUnicornBuilding, nodeAutoPraise, nodeAdore, nodeTranscend];
  }

  getState(): ReligionSettings {
    return new ReligionSettings(
      this._settings.enabled,
      this._settings.trigger,
      this._settings.items,
      this._settings.bestUnicornBuilding,
      this._settings.autoPraise,
      this._settings.adore,
      this._settings.transcend
    );
  }

  setState(state: ReligionSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    this._settings.adore.enabled = state.adore.enabled;
    this._settings.adore.trigger = state.adore.trigger;
    this._settings.autoPraise.enabled = state.autoPraise.enabled;
    this._settings.autoPraise.trigger = state.autoPraise.trigger;
    this._settings.bestUnicornBuilding.enabled = state.bestUnicornBuilding.enabled;
    this._settings.transcend.enabled = state.transcend.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = this._renderPercentage(this._settings.trigger);

    mustExist(this._settings.adore.$enabled).prop("checked", this._settings.adore.enabled);
    mustExist(this._settings.adore.$trigger)[0].title = this._renderPercentage(
      this._settings.adore.trigger
    );
    mustExist(this._settings.autoPraise.$enabled).prop(
      "checked",
      this._settings.autoPraise.enabled
    );
    mustExist(this._settings.autoPraise.$trigger)[0].title = this._renderPercentage(
      this._settings.autoPraise.trigger
    );
    mustExist(this._settings.bestUnicornBuilding.$enabled).prop(
      "checked",
      this._settings.bestUnicornBuilding.enabled
    );
    mustExist(this._settings.transcend.$enabled).prop("checked", this._settings.transcend.enabled);

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
      mustExist(option.$max).text(
        this._host.i18n("ui.max", [this._renderLimit(this._settings.items[name].max)])
      );
    }
  }
}
