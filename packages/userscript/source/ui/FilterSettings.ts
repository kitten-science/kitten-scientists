import { Options } from "../Options";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingsSection } from "./SettingsSection";

export class FiltersSettings extends SettingsSection {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: Options["auto"]["filter"];

  private readonly _itemsButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(
    host: UserScript,
    religionOptions: Options["auto"]["filter"] = host.options.auto.filter
  ) {
    super(host);

    this._options = religionOptions;

    const toggleName = "filter";

    const itext = ucfirst(this._host.i18n("ui.filter"));

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
      this.getOption(
        "buildFilter",
        this._options.items.buildFilter,
        this._host.i18n("filter.build")
      ),
      this.getOption(
        "craftFilter",
        this._options.items.craftFilter,
        this._host.i18n("filter.craft")
      ),
      this.getOption(
        "upgradeFilter",
        this._options.items.upgradeFilter,
        this._host.i18n("filter.upgrade")
      ),
      this.getOption(
        "researchFilter",
        this._options.items.researchFilter,
        this._host.i18n("filter.research")
      ),
      this.getOption(
        "tradeFilter",
        this._options.items.tradeFilter,
        this._host.i18n("filter.trade")
      ),
      this.getOption(
        "huntFilter",
        this._options.items.huntFilter,
        this._host.i18n("filter.hunt")
      ),
      this.getOption(
        "praiseFilter",
        this._options.items.praiseFilter,
        this._host.i18n("filter.praise")
      ),
      this.getOption(
        "adoreFilter",
        this._options.items.adoreFilter,
        this._host.i18n("filter.adore")
      ),
      this.getOption(
        "transcendFilter",
        this._options.items.transcendFilter,
        this._host.i18n("filter.transcend")
      ),
      this.getOption(
        "faithFilter",
        this._options.items.faithFilter,
        this._host.i18n("filter.faith")
      ),
      this.getOption(
        "accelerateFilter",
        this._options.items.accelerateFilter,
        this._host.i18n("filter.accelerate")
      ),
      this.getOption(
        "timeSkipFilter",
        this._options.items.timeSkipFilter,
        this._host.i18n("filter.time.skip")
      ),
      this.getOption(
        "festivalFilter",
        this._options.items.festivalFilter,
        this._host.i18n("filter.festival")
      ),
      this.getOption(
        "starFilter",
        this._options.items.starFilter,
        this._host.i18n("filter.star")
      ),
      this.getOption(
        "distributeFilter",
        this._options.items.distributeFilter,
        this._host.i18n("filter.distribute")
      ),
      this.getOption(
        "promoteFilter",
        this._options.items.promoteFilter,
        this._host.i18n("filter.promote")
      ),
      this.getOption(
        "miscFilter",
        this._options.items.miscFilter,
        this._host.i18n("filter.misc")
      ),
      
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
