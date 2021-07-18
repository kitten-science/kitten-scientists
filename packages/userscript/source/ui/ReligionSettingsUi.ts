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

  private _itemsExpanded = false;

  constructor(host: UserScript, religionOptions: ReligionSettings = host.options.auto.religion) {
    super(host);

    this._options = religionOptions;

    const toggleName = "faith";

    const itext = ucfirst(this._host.i18n("ui.faith"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, itext);

    this._options.$enabled = element.checkbox;

    element.checkbox.on("change", () => {
      if (element.checkbox.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!element.checkbox.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    // Create "trigger" button in the item.
    const triggerButton = $("<div/>", {
      id: `trigger-${toggleName}`,
      text: this._host.i18n("ui.trigger"),
      //title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });
    this._options.$trigger = triggerButton;

    triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toFixed(2)
      );

      if (value !== null) {
        this._host.updateOptions(() => (this._options.trigger = parseFloat(value)));
        triggerButton[0].title = this._options.trigger.toFixed(2);
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    element.items.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      element.items.text(this._itemsExpanded ? "-" : "+");
      element.items.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    const optionButtons = [
      this._getHeader(this._host.i18n("$religion.panel.ziggurat.label")),
      this._getOption(
        "unicornPasture",
        this._options.items.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this._getOption(
        "unicornTomb",
        this._options.items.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getOption(
        "ivoryTower",
        this._options.items.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getOption(
        "ivoryCitadel",
        this._options.items.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getOption(
        "skyPalace",
        this._options.items.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this._getOption(
        "unicornUtopia",
        this._options.items.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getOption(
        "sunspire",
        this._options.items.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getOption(
        "marker",
        this._options.items.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this._getOption(
        "unicornGraveyard",
        this._options.items.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getOption(
        "unicornNecropolis",
        this._options.items.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getOption(
        "blackPyramid",
        this._options.items.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.orderOfTheSun.label")),
      this._getOption(
        "solarchant",
        this._options.items.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this._getOption(
        "scholasticism",
        this._options.items.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this._getOption(
        "goldenSpire",
        this._options.items.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getOption(
        "sunAltar",
        this._options.items.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this._getOption(
        "stainedGlass",
        this._options.items.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getOption(
        "solarRevolution",
        this._options.items.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getOption(
        "basilica",
        this._options.items.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this._getOption(
        "templars",
        this._options.items.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this._getOption(
        "apocripha",
        this._options.items.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this._getOption(
        "transcendence",
        this._options.items.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.cryptotheology.label")),
      this._getOption(
        "blackObelisk",
        this._options.items.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getOption(
        "blackNexus",
        this._options.items.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this._getOption(
        "blackCore",
        this._options.items.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this._getOption(
        "singularity",
        this._options.items.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this._getOption(
        "blackLibrary",
        this._options.items.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getOption(
        "blackRadiance",
        this._options.items.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getOption(
        "blazar",
        this._options.items.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this._getOption(
        "darkNova",
        this._options.items.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this._getOption(
        "holyGenocide",
        this._options.items.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];

    list.append(...optionButtons);

    const additionOptions = this.getAdditionOptions();

    element.panel.append(triggerButton);
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

    const nodeAdore = this._getOption(
      "adore",
      this._options.addition.adore,
      this._host.i18n("option.faith.adore"),
      false,
      {
        onCheck: () => {
          this._options.addition.adore.enabled = true;
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.adore")]);
        },
        onUnCheck: () => {
          this._options.addition.adore.enabled = false;
          this._host.imessage("status.sub.disable", [this._host.i18n("option.faith.adore")]);
        },
      }
    );

    const triggerButtonAdore = $("<div/>", {
      id: "set-adore-subTrigger",
      text: this._host.i18n("ui.trigger"),
      //title: addi.adore.subTrigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    }).data("option", this._options.addition.adore);
    this._options.addition.adore.$subTrigger = triggerButtonAdore;

    triggerButtonAdore.on("click", () => {
      const value = window.prompt(
        this._host.i18n("adore.trigger.set"),
        this._options.addition.adore.subTrigger.toFixed(2)
      );

      if (value !== null) {
        this._host.updateOptions(
          () => (this._options.addition.adore.subTrigger = parseFloat(value))
        );
        triggerButtonAdore[0].title = this._options.addition.adore.subTrigger.toFixed(2);
      }
    });

    nodeAdore.append(triggerButtonAdore);

    const nodeAutoPraise = this._getOption(
      "autoPraise",
      this._options.addition.autoPraise,
      this._host.i18n("option.praise"),
      false,
      {
        onCheck: () => {
          this._options.addition.autoPraise.enabled = true;
          this._host.imessage("status.sub.enable", [this._host.i18n("option.praise")]);
        },
        onUnCheck: () => {
          this._options.addition.autoPraise.enabled = false;
          this._host.imessage("status.sub.disable", [this._host.i18n("option.praise")]);
        },
      }
    );

    const triggerButtonAutoPraise = $("<div/>", {
      id: "set-autoPraise-subTrigger",
      text: this._host.i18n("ui.trigger"),
      title: this._options.addition.autoPraise.subTrigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    }).data("option", this._options.addition.autoPraise);
    this._options.addition.autoPraise.$subTrigger = triggerButtonAutoPraise;

    triggerButtonAutoPraise.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [this._host.i18n("option.praise")]),
        this._options.addition.autoPraise.subTrigger.toFixed(2)
      );

      if (value !== null) {
        this._host.updateOptions(
          () => (this._options.addition.autoPraise.subTrigger = parseFloat(value))
        );
        triggerButtonAutoPraise[0].title = this._options.addition.autoPraise.subTrigger.toFixed(2);
      }
    });

    nodeAutoPraise.append(triggerButtonAutoPraise);

    const nodeBestUnicornBuilding = this._getOption(
      "bestUnicornBuilding",
      this._options.addition.bestUnicornBuilding,
      this._host.i18n("option.faith.best.unicorn"),
      false,
      {
        onCheck: () => {
          this._options.addition.bestUnicornBuilding.enabled = true;
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.best.unicorn")]);
        },
        onUnCheck: () => {
          this._options.addition.bestUnicornBuilding.enabled = false;
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
            option.variant !== UnicornItemVariant.Unknown_zp &&
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
      {
        onCheck: () => {
          this._options.addition.transcend.enabled = true;
          this._host.imessage("status.sub.enable", [this._host.i18n("option.faith.transcend")]);
        },
        onUnCheck: () => {
          this._options.addition.transcend.enabled = false;
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
    this._options.addition.adore.subTrigger = state.addition.adore.subTrigger;
    this._options.addition.autoPraise.enabled = state.addition.autoPraise.enabled;
    this._options.addition.autoPraise.subTrigger = state.addition.autoPraise.subTrigger;
    this._options.addition.bestUnicornBuilding.enabled = state.addition.bestUnicornBuilding.enabled;
    this._options.addition.transcend.enabled = state.addition.transcend.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    mustExist(this._options.addition.adore.$enabled).prop(
      "checked",
      this._options.addition.adore.enabled
    );
    mustExist(this._options.addition.adore.$subTrigger)[0].title =
      this._options.addition.adore.subTrigger.toFixed(2);
    mustExist(this._options.addition.autoPraise.$enabled).prop(
      "checked",
      this._options.addition.autoPraise.enabled
    );
    mustExist(this._options.addition.autoPraise.$subTrigger)[0].title =
      this._options.addition.autoPraise.subTrigger.toFixed(2);
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
    }
  }
}
