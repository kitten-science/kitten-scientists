import { ReligionSettings } from "../options/ReligionSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UnicornItemVariant } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: ReligionSettings;

  constructor(host: UserScript, religionOptions: ReligionSettings = host.options.auto.religion) {
    super(host);

    this._options = religionOptions;

    const toggleName = "faith";
    const label = ucfirst(this._host.i18n("ui.faith"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._options.$trigger = this._registerTriggerButton(toggleName, label, this._options);

    const optionButtons = [
      this._getHeader(this._host.i18n("$religion.panel.ziggurat.label")),
      this._getBuildOption(
        "unicornPasture",
        this._options.items.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this._getBuildOption(
        "unicornTomb",
        this._options.items.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getBuildOption(
        "ivoryTower",
        this._options.items.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getBuildOption(
        "ivoryCitadel",
        this._options.items.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getBuildOption(
        "skyPalace",
        this._options.items.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this._getBuildOption(
        "unicornUtopia",
        this._options.items.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getBuildOption(
        "sunspire",
        this._options.items.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getBuildOption(
        "marker",
        this._options.items.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this._getBuildOption(
        "unicornGraveyard",
        this._options.items.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getBuildOption(
        "unicornNecropolis",
        this._options.items.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getBuildOption(
        "blackPyramid",
        this._options.items.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.orderOfTheSun.label")),
      this._getBuildOption(
        "solarchant",
        this._options.items.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this._getBuildOption(
        "scholasticism",
        this._options.items.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this._getBuildOption(
        "goldenSpire",
        this._options.items.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getBuildOption(
        "sunAltar",
        this._options.items.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this._getBuildOption(
        "stainedGlass",
        this._options.items.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getBuildOption(
        "solarRevolution",
        this._options.items.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getBuildOption(
        "basilica",
        this._options.items.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this._getBuildOption(
        "templars",
        this._options.items.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this._getBuildOption(
        "apocripha",
        this._options.items.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this._getBuildOption(
        "transcendence",
        this._options.items.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.cryptotheology.label")),
      this._getBuildOption(
        "blackObelisk",
        this._options.items.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getBuildOption(
        "blackNexus",
        this._options.items.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this._getBuildOption(
        "blackCore",
        this._options.items.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this._getBuildOption(
        "singularity",
        this._options.items.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this._getBuildOption(
        "blackLibrary",
        this._options.items.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getBuildOption(
        "blackRadiance",
        this._options.items.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getBuildOption(
        "blazar",
        this._options.items.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this._getBuildOption(
        "darkNova",
        this._options.items.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this._getBuildOption(
        "holyGenocide",
        this._options.items.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];

    list.append(...optionButtons);

    const additionOptions = this.getAdditionOptions();

    element.panel.append(this._options.$trigger);
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
      this._options.addition.adore,
      this._host.i18n("option.faith.adore"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.adore.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.adore")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.adore.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.adore")]);
        },
      }
    );

    const nodeAutoPraise = this._getOptionWithTrigger(
      "autoPraise",
      this._options.addition.autoPraise,
      this._host.i18n("option.praise"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.autoPraise.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.praise")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.autoPraise.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.praise")]);
        },
      }
    );

    const nodeBestUnicornBuilding = this._getOption(
      "bestUnicornBuilding",
      this._options.addition.bestUnicornBuilding,
      this._host.i18n("option.faith.best.unicorn"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(
            () => (this._options.addition.bestUnicornBuilding.enabled = true)
          );
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.best.unicorn")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(
            () => (this._options.addition.bestUnicornBuilding.enabled = false)
          );
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.best.unicorn")]);
        },
      }
    );

    nodeBestUnicornBuilding
      .children("label")
      .prop("title", this._host.i18n("option.faith.best.unicorn.desc"));
    const input = nodeBestUnicornBuilding.children("input");
    input.unbind("change");
    const bub = this._options.addition.bestUnicornBuilding;
    input.on("change", () => {
      if (input.is(":checked") && !bub.enabled) {
        this._host.updateOptions(() => (bub.enabled = true));
        // enable all unicorn buildings
        for (const [unicornName, option] of objectEntries(this._options.items)) {
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
      this._options.addition.transcend,
      this._host.i18n("option.faith.transcend"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.transcend.enabled = true));
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.transcend")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.transcend.enabled = false));
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.transcend")]);
        },
      }
    );

    return [nodeHeader, nodeBestUnicornBuilding, nodeAutoPraise, nodeAdore, nodeTranscend];
  }

  getState(): ReligionSettings {
    return {
      enabled: this._options.enabled,
      trigger: this._options.trigger,
      addition: this._options.addition,
      items: this._options.items,
    };
  }

  setState(state: ReligionSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    this._options.addition.adore.enabled = state.addition.adore.enabled;
    this._options.addition.adore.trigger = state.addition.adore.trigger;
    this._options.addition.autoPraise.enabled = state.addition.autoPraise.enabled;
    this._options.addition.autoPraise.trigger = state.addition.autoPraise.trigger;
    this._options.addition.bestUnicornBuilding.enabled = state.addition.bestUnicornBuilding.enabled;
    this._options.addition.transcend.enabled = state.addition.transcend.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._renderPercentage(this._options.trigger);

    mustExist(this._options.addition.adore.$enabled).prop(
      "checked",
      this._options.addition.adore.enabled
    );
    mustExist(this._options.addition.adore.$trigger)[0].title = this._renderPercentage(
      this._options.addition.adore.trigger
    );
    mustExist(this._options.addition.autoPraise.$enabled).prop(
      "checked",
      this._options.addition.autoPraise.enabled
    );
    mustExist(this._options.addition.autoPraise.$trigger)[0].title = this._renderPercentage(
      this._options.addition.autoPraise.trigger
    );
    mustExist(this._options.addition.bestUnicornBuilding.$enabled).prop(
      "checked",
      this._options.addition.bestUnicornBuilding.enabled
    );
    mustExist(this._options.addition.transcend.$enabled).prop(
      "checked",
      this._options.addition.transcend.enabled
    );

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(
        this._host.i18n("ui.max", [this._renderLimit(this._options.items[name].max)])
      );
    }
  }
}
