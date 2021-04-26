import { ReligionSettings } from "../options/ReligionSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ReligionSettingsUi extends SettingsSectionUi<ReligionSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: ReligionSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, religionOptions: ReligionSettings = host.options.auto.religion) {
    super(host);

    this._options = religionOptions;

    const toggleName = "faith";

    const itext = ucfirst(this._host.i18n("ui.faith"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: "trigger-" + toggleName,
      text: this._host.i18n("ui.trigger"),
      title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger
      );

      if (value !== null) {
        this._options.trigger = parseFloat(value);
        //this._host.saveToKittenStorage();
        this._triggerButton[0].title = this._options.trigger;
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: this._host.i18n("ui.items"),
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
    });

    this._buildingButtons = [
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
        this._host.i18n("$religion.tu.holyGenocide.label")
      ),
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);

    this.element = element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
