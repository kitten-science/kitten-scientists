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

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, religionOptions: ReligionSettings = host.options.auto.religion) {
    super(host);

    this._options = religionOptions;

    const toggleName = "faith";

    const itext = ucfirst(this._host.i18n("ui.faith"));

    // Our main element is a list item.
    const element = $("<li/>", { id: `ks-${toggleName}` });

    const label = $("<label/>", {
      text: itext,
    });
    label.on("click", () => this._itemsButton.trigger("click"));

    const input = $("<input/>", {
      id: `toggle-${toggleName}`,
      type: "checkbox",
    });
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: `trigger-${toggleName}`,
      text: this._host.i18n("ui.trigger"),
      //title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    this._options.$trigger = this._triggerButton;

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toFixed(2)
      );

      if (value !== null) {
        this._host.updateOptions(() => (this._options.trigger = parseFloat(value)));
        this._triggerButton[0].title = this._options.trigger.toFixed(2);
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: `toggle-items-${toggleName}`,
      text: "+",
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._itemsButton.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      this._itemsButton.text(this._itemsExpanded ? "-" : "+");
      this._itemsButton.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    this._optionButtons = [
      this._getHeader(this._host.i18n("$religion.panel.ziggurat.label")),
      this.getOption(
        "unicornPasture",
        this._options.items.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this.getOption(
        "unicornTomb",
        this._options.items.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this.getOption(
        "ivoryTower",
        this._options.items.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this.getOption(
        "ivoryCitadel",
        this._options.items.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this.getOption(
        "skyPalace",
        this._options.items.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this.getOption(
        "unicornUtopia",
        this._options.items.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this.getOption(
        "sunspire",
        this._options.items.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this.getOption(
        "marker",
        this._options.items.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this.getOption(
        "unicornGraveyard",
        this._options.items.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this.getOption(
        "unicornNecropolis",
        this._options.items.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this.getOption(
        "blackPyramid",
        this._options.items.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.orderOfTheSun.label")),
      this.getOption(
        "solarchant",
        this._options.items.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this.getOption(
        "scholasticism",
        this._options.items.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this.getOption(
        "goldenSpire",
        this._options.items.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this.getOption(
        "sunAltar",
        this._options.items.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this.getOption(
        "stainedGlass",
        this._options.items.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this.getOption(
        "solarRevolution",
        this._options.items.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this.getOption(
        "basilica",
        this._options.items.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this.getOption(
        "templars",
        this._options.items.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this.getOption(
        "apocripha",
        this._options.items.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this.getOption(
        "transcendence",
        this._options.items.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getHeader(this._host.i18n("$religion.panel.cryptotheology.label")),
      this.getOption(
        "blackObelisk",
        this._options.items.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this.getOption(
        "blackNexus",
        this._options.items.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this.getOption(
        "blackCore",
        this._options.items.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this.getOption(
        "singularity",
        this._options.items.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this.getOption(
        "blackLibrary",
        this._options.items.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this.getOption(
        "blackRadiance",
        this._options.items.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this.getOption(
        "blazar",
        this._options.items.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this.getOption(
        "darkNova",
        this._options.items.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this.getOption(
        "holyGenocide",
        this._options.items.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label"),
        true
      ),
    ];

    list.append(...this._optionButtons);

    const additionOptions = this.getAdditionOptions();

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);
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

    this.element = element;
  }

  getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const nodeHeader = this._getHeader("Additional options");

    const nodeAdore = this.getOption(
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
        textShadow: "3px 3px 4px gray",
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

    const nodeAutoPraise = this.getOption(
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
        textShadow: "3px 3px 4px gray",
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

    const nodeBestUnicornBuilding = this.getOption(
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

    const nodeTranscend = this.getOption(
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
