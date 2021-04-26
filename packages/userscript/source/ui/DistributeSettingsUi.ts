import { DistributeSettings } from "../options/DistributeSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingsSection } from "./SettingsSection";

export class DistributeSettingsUi extends SettingsSection {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: DistributeSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: DistributeSettings = host.options.auto.distribute) {
    super(host);

    this._options = options;

    const toggleName = "distribute";

    const itext = ucfirst(this._host.i18n("ui.distribute"));

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
      this.getDistributeOption(
        "woodcutter",
        this._options.items.woodcutter,
        this._host.i18n("$village.job.woodcutter")
      ),
      this.getDistributeOption(
        "farmer",
        this._options.items.farmer,
        this._host.i18n("$village.job.farmer")
      ),
      this.getDistributeOption(
        "scholar",
        this._options.items.scholar,
        this._host.i18n("$village.job.scholar")
      ),
      this.getDistributeOption(
        "hunter",
        this._options.items.hunter,
        this._host.i18n("$village.job.hunter")
      ),
      this.getDistributeOption(
        "miner",
        this._options.items.miner,
        this._host.i18n("$village.job.miner")
      ),
      this.getDistributeOption(
        "priest",
        this._options.items.priest,
        this._host.i18n("$village.job.priest")
      ),
      this.getDistributeOption(
        "geologist",
        this._options.items.geologist,
        this._host.i18n("$village.job.geologist")
      ),
      this.getDistributeOption(
        "engineer",
        this._options.items.engineer,
        this._host.i18n("$village.job.engineer")
      ),
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private getDistributeOption(
    name: string,
    option: { enabled: boolean; limited: boolean; max: number },
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Distribution
    const labelElement = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("distribute.limited", [label]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("distribute.unlimited", [label]);
      }
      //kittenStorage.items[input.attr("id")] = option.limited;
      //this._host.saveToKittenStorage();
    });

    element.append(input, labelElement);

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: this._host.i18n("ui.max", [option.max]),
      title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [label]), option.max.toString());

      if (value !== null) {
        option.max = parseInt(value);
        //kittenStorage.items[maxButton.attr("id")] = option.max;
        //this._host.saveToKittenStorage();
        maxButton[0].title = option.max.toString();
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
