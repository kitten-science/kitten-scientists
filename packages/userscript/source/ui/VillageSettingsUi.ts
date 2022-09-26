import { SettingMax } from "../options/Settings";
import { VillageAdditionSettings, VillageSettings } from "../options/VillageSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class VillageSettingsUi extends SettingsSectionUi<VillageSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: VillageSettings;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: VillageSettings = host.options.auto.village) {
    super(host);

    this._options = options;

    const toggleName = "distribute";
    const label = ucfirst(this._host.i18n("ui.distribute"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    this._optionButtons = [
      this._getDistributeOption(
        "woodcutter",
        this._options.items.woodcutter,
        this._host.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        "farmer",
        this._options.items.farmer,
        this._host.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        "scholar",
        this._options.items.scholar,
        this._host.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        "hunter",
        this._options.items.hunter,
        this._host.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        "miner",
        this._options.items.miner,
        this._host.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        "priest",
        this._options.items.priest,
        this._host.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        "geologist",
        this._options.items.geologist,
        this._host.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        "engineer",
        this._options.items.engineer,
        this._host.i18n("$village.job.engineer"),
        true
      ),
    ];

    list.append(...this._optionButtons);

    const additionOptions = this.getAdditionOptions(this._options.addition);
    list.append(additionOptions);

    element.panel.append(list);

    this.element = element.panel;
  }

  private _getDistributeOption(
    name: string,
    option: SettingMax,
    label: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = this._getOptionWithMax(name, option, label, delimiter, false, {
      onCheck: () => {
        this._host.updateOptions(() => (option.enabled = true));
        this._host.imessage("status.auto.enable", [label]);
      },
      onUnCheck: () => {
        this._host.updateOptions(() => (option.enabled = false));
        this._host.imessage("status.auto.disable", [label]);
      },
    });
    return element;
  }

  getAdditionOptions(addition: VillageAdditionSettings): Array<JQuery<HTMLElement>> {
    const nodeHeader = this._getHeader("Additional options");

    const nodeHunt = this._getOptionWithTrigger(
      "hunt",
      addition.hunt,
      this._host.i18n("option.hunt"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.hunt.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.hunt.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.hunt")]);
        },
      }
    );

    const nodeFestivals = this._getOption(
      "festival",
      addition.holdFestivals,
      this._host.i18n("option.festival"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.holdFestivals.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.festival")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.holdFestivals.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.festival")]);
        },
      }
    );

    const nodePromote = this._getOption(
      "promote",
      addition.promoteLeader,
      this._host.i18n("option.promote"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.addition.promoteLeader.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.promote")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.addition.promoteLeader.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.promote")]);
        },
      }
    );

    return [nodeHeader, nodeHunt, nodeFestivals, nodePromote];
  }

  getState(): VillageSettings {
    return new VillageSettings(
      this._options.enabled,
      this._options.items,
      this._options.addition.holdFestivals,
      this._options.addition.hunt,
      this._options.addition.promoteLeader
    );
  }

  setState(state: VillageSettings): void {
    this._options.enabled = state.enabled;

    this._options.addition.holdFestivals.enabled = state.addition.holdFestivals.enabled;
    this._options.addition.hunt.enabled = state.addition.hunt.enabled;
    this._options.addition.promoteLeader.enabled = state.addition.promoteLeader.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    mustExist(this._options.addition.holdFestivals.$enabled).prop(
      "checked",
      this._options.addition.holdFestivals.enabled
    );
    mustExist(this._options.addition.hunt.$enabled).prop(
      "checked",
      this._options.addition.hunt.enabled
    );
    mustExist(this._options.addition.hunt.$trigger)[0].title = this._renderPercentage(
      this._options.addition.hunt.trigger
    );
    mustExist(this._options.addition.promoteLeader.$enabled).prop(
      "checked",
      this._options.addition.promoteLeader.enabled
    );

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(
        this._host.i18n("ui.max", [this._renderLimit(this._options.items[name].max)])
      );
    }
  }
}
