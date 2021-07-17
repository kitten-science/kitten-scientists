import { OptionsSettings, OptionsSettingsItem } from "../options/OptionsSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi<OptionsSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: OptionsSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: OptionsSettings = host.options.auto.options) {
    super(host);

    this._options = options;

    const toggleName = "options";

    const itext = ucfirst(this._host.i18n("ui.options"));

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
        this._options.enabled = true;

        this._host.imessage("status.auto.enable", [itext]);
        //saveToKittenStorage();
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._options.enabled = false;
        this._host.imessage("status.auto.disable", [itext]);
        //saveToKittenStorage();
      }
    });

    element.append(input, label);

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
      this._getOptionsOption(
        "observe",
        this._options.items.observe,
        this._host.i18n("option.observe")
      ),
      this._getOptionsOption(
        "festival",
        this._options.items.festival,
        this._host.i18n("option.festival")
      ),
      this._getOptionsOption(
        "shipOverride",
        this._options.items.shipOverride,
        this._host.i18n("option.shipOverride")
      ),
      this._getOptionsOption(
        "autofeed",
        this._options.items.autofeed,
        this._host.i18n("option.autofeed")
      ),
      this._getOptionsOption("hunt", this._options.items.hunt, this._host.i18n("option.hunt")),
      this._getOptionsOption(
        "promote",
        this._options.items.promote,
        this._host.i18n("option.promote")
      ),
      this._getOptionsOption(
        "crypto",
        this._options.items.crypto,
        this._host.i18n("option.crypto")
      ),
      this._getOptionsOption(
        "fixCry",
        this._options.items.fixCry,
        this._host.i18n("option.fix.cry")
      ),
      this._getOptionsOption(
        "buildEmbassies",
        this._options.items.buildEmbassies,
        this._host.i18n("option.embassies")
      ),
      this._getOptionsOption("style", this._options.items.style, this._host.i18n("option.style")),
      this._getOptionsOption(
        "_steamworks",
        this._options.items._steamworks,
        this._host.i18n("option.steamworks")
      ),
    ];

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private _getOptionsOption(
    name: string,
    option: OptionsSettingsItem,
    iname: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, iname);

    // hack for style.
    // If there are more UI options, split it to "getUIOption"
    if (name === "style") {
      const input = element.children("input");
      input.unbind("change");
      input.on("change", () => {
        option.enabled = input.prop("checked");
        //kittenStorage.items[input.attr("id")] = option.enabled;
        //this._host.saveToKittenStorage();
        if (option.enabled) {
          document.body.setAttribute("data-ks-style", "");
        } else {
          document.body.removeAttribute("data-ks-style");
        }
      });
    }

    if (option.subTrigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: `set-${name}-subTrigger`,
        text: this._host.i18n("ui.trigger"),
        //title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      option.$subTrigger = triggerButton;

      triggerButton.on("click", () => {
        let value;
        if (name === "crypto") {
          value = window.prompt(
            this._host.i18n("ui.trigger.crypto.set", [iname]),
            mustExist(option.subTrigger).toFixed(2)
          );
        } else {
          value = window.prompt(
            this._host.i18n("ui.trigger.set", [iname]),
            mustExist(option.subTrigger).toFixed(2)
          );
        }

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          //kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          //this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger.toFixed(2);
        }
      });

      element.append(triggerButton);
    }

    return element;
  }

  setState(state: OptionsSettings): void {
    this._options.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;

      if (!isNil(option.$subTrigger)) {
        option.subTrigger = state.items[name].subTrigger;
      }
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);

      if (!isNil(option.$subTrigger)) {
        option.$subTrigger[0].title = mustExist(this._options.items[name].subTrigger).toFixed(2);
      }
    }
  }
}
