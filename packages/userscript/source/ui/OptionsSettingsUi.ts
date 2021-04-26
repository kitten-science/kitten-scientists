import { OptionsSettings } from "../options/OptionsSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi<OptionsSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: OptionsSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: OptionsSettings = host.options.auto.options) {
    super(host);

    this._options = options;

    const toggleName = "options";

    const itext = ucfirst(this._host.i18n("ui.options"));

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
        "explore",
        this._options.items.explore,
        this._host.i18n("option.explore")
      ),
      this._getOptionsOption(
        "_steamworks",
        this._options.items._steamworks,
        this._host.i18n("option.steamworks")
      ),
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private _getOptionsOption(
    name: string,
    option: { enabled: boolean;subTrigger?: number },
    iname: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, iname);

    // hack for style.
    // If there are more UI options, split it to "getUIOption"
    if (name == "style") {
      const input = element.children("input");
      input.unbind("change");
      input.on("change", () => {
        option.enabled = input.prop("checked");
        kittenStorage.items[input.attr("id")] = option.enabled;
        this._host.saveToKittenStorage();
        if (option.enabled) {
          document.body.setAttribute("data-ks-style", "");
        } else {
          document.body.removeAttribute("data-ks-style");
        }
      });
    }

    if (option.subTrigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: "set-" + name + "-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);

      triggerButton.on("click", () => {
        let value;
        if (name == "crypto") {
          value = window.prompt(
            this._host.i18n("ui.trigger.crypto.set", [option.label]),
            option.subTrigger
          );
        } else {
          value = window.prompt(
            this._host.i18n("ui.trigger.set", [option.label]),
            option.subTrigger
          );
        }

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      element.append(triggerButton);
    }

    return element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
