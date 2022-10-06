import { SettingMax } from "../options/Settings";
import { VillageSettings } from "../options/VillageSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingMaxUi } from "./SettingMaxUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingTriggerUi } from "./SettingTriggerUi";
import { SettingUi } from "./SettingUi";

export class VillageSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: VillageSettings;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, settings: VillageSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "distribute";
    const label = ucfirst(this._host.engine.i18n("ui.distribute"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    this._optionButtons = [
      this._getDistributeOption(
        "woodcutter",
        this._settings.items.woodcutter,
        this._host.engine.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        "farmer",
        this._settings.items.farmer,
        this._host.engine.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        "scholar",
        this._settings.items.scholar,
        this._host.engine.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        "hunter",
        this._settings.items.hunter,
        this._host.engine.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        "miner",
        this._settings.items.miner,
        this._host.engine.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        "priest",
        this._settings.items.priest,
        this._host.engine.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        "geologist",
        this._settings.items.geologist,
        this._host.engine.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        "engineer",
        this._settings.items.engineer,
        this._host.engine.i18n("$village.job.engineer"),
        true
      ),
    ];

    list.append(...this._optionButtons);

    const additionOptions = this._getAdditionOptions();
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
    const element = SettingMaxUi.make(this._host, name, option, label, delimiter, false, {
      onCheck: () => {
        this._host.updateOptions(() => (option.enabled = true));
        this._host.engine.imessage("status.auto.enable", [label]);
      },
      onUnCheck: () => {
        this._host.updateOptions(() => (option.enabled = false));
        this._host.engine.imessage("status.auto.disable", [label]);
      },
    });
    return element;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const nodeHeader = this._getHeader("Additional options");

    const nodeHunt = SettingTriggerUi.make(
      this._host,
      "hunt",
      this._settings.hunt,
      this._host.engine.i18n("option.hunt"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.hunt.enabled = true));
          this._host.engine.imessage("status.auto.enable", [this._host.engine.i18n("option.hunt")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.hunt.enabled = false));
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.hunt"),
          ]);
        },
      }
    );

    const nodeFestivals = SettingUi.make(
      this._host,
      "festival",
      this._settings.holdFestivals,
      this._host.engine.i18n("option.festival"),
      false,
      false,
      [],
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.holdFestivals.enabled = true));
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.festival"),
          ]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.holdFestivals.enabled = false));
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.festival"),
          ]);
        },
      }
    );

    const nodePromote = SettingUi.make(
      this._host,
      "promote",
      this._settings.promoteLeader,
      this._host.engine.i18n("option.promote"),
      false,
      false,
      [],
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.promoteLeader.enabled = true));
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.promote"),
          ]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.promoteLeader.enabled = false));
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.promote"),
          ]);
        },
      }
    );

    return [nodeHeader, nodeHunt, nodeFestivals, nodePromote];
  }

  setState(state: VillageSettings): void {
    this._settings.enabled = state.enabled;

    this._settings.holdFestivals.enabled = state.holdFestivals.enabled;
    this._settings.hunt.enabled = state.hunt.enabled;
    this._settings.promoteLeader.enabled = state.promoteLeader.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);

    mustExist(this._settings.holdFestivals.$enabled).prop(
      "checked",
      this._settings.holdFestivals.enabled
    );
    mustExist(this._settings.hunt.$enabled).prop("checked", this._settings.hunt.enabled);
    mustExist(this._settings.hunt.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.hunt.trigger
    );
    mustExist(this._settings.promoteLeader.$enabled).prop(
      "checked",
      this._settings.promoteLeader.enabled
    );

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
      mustExist(option.$max).text(
        this._host.engine.i18n("ui.max", [this._renderLimit(this._settings.items[name].max)])
      );
    }
  }
}
