import { Options } from "../options/Options";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { BonfireSettingsUi } from "./BonfireSettingsUi";
import { EngineSettingsUi } from "./EngineSettingsUi";
import { FiltersSettingsUi } from "./FilterSettingsUi";
import { OptionsSettingsUi } from "./OptionsSettingsUi";
import { ReligionSettingsUi } from "./ReligionSettingsUi";
import { ScienceSettingsUi } from "./ScienceSettingsUi";
import { SpaceSettingsUi } from "./SpaceSettingsUi";
import { TimeControlSettingsUi } from "./TimeControlSettingsUi";
import { TimeSettingsUi } from "./TimeSettingsUi";
import { TradingSettingsUi } from "./TradingSettingsUi";
import { VillageSettingsUi } from "./VillageSettingsUi";
import { WorkshopSettingsUi } from "./WorkshopSettingsUi";

export class UserInterface {
  private readonly _host: UserScript;

  private _engineUi: EngineSettingsUi;
  private _bonfireUi: BonfireSettingsUi;
  private _spaceUi: SpaceSettingsUi;
  private _craftUi: WorkshopSettingsUi;
  private _unlockUi: ScienceSettingsUi;
  private _tradingUi: TradingSettingsUi;
  private _religionUi: ReligionSettingsUi;
  private _timeUi: TimeSettingsUi;
  private _timeCtrlUi: TimeControlSettingsUi;
  private _distributeUi: VillageSettingsUi;
  private _optionsUi: OptionsSettingsUi;
  private _filterUi: FiltersSettingsUi;

  constructor(host: UserScript) {
    this._host = host;

    this._engineUi = new EngineSettingsUi(this._host);
    this._bonfireUi = new BonfireSettingsUi(this._host);
    this._spaceUi = new SpaceSettingsUi(this._host);
    this._craftUi = new WorkshopSettingsUi(this._host);
    this._unlockUi = new ScienceSettingsUi(this._host);
    this._tradingUi = new TradingSettingsUi(this._host);
    this._religionUi = new ReligionSettingsUi(this._host);
    this._timeUi = new TimeSettingsUi(this._host);
    this._timeCtrlUi = new TimeControlSettingsUi(this._host);
    this._distributeUi = new VillageSettingsUi(this._host);
    this._optionsUi = new OptionsSettingsUi(this._host);
    this._filterUi = new FiltersSettingsUi(this._host);
  }

  construct(): void {
    this._installCss();

    const kg_version = "Kitten Scientists v" + (KS_VERSION ?? "(unknown)");
    const optionsElement = $("<div/>", { id: "ks-options", css: { marginBottom: "10px" } });
    const optionsListElement = $("<ul/>");
    const optionsTitleElement = $("<div/>", {
      css: { bottomBorder: "1px solid gray", marginBottom: "5px" },
      text: kg_version,
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(this._engineUi.element);
    optionsListElement.append(this._bonfireUi.element);
    optionsListElement.append(this._distributeUi.element);
    optionsListElement.append(this._unlockUi.element);
    optionsListElement.append(this._craftUi.element);
    optionsListElement.append(this._tradingUi.element);
    optionsListElement.append(this._religionUi.element);
    optionsListElement.append(this._spaceUi.element);
    optionsListElement.append(this._timeUi.element);
    optionsListElement.append(this._timeCtrlUi.element);
    optionsListElement.append(this._optionsUi.element);
    optionsListElement.append(this._filterUi.element);

    // Make _engineUI's expando button hide/show the other option groups
    // Currently accesses the button via id.
    const optionsToggle = this._engineUi.element.children("#toggle-items-engine");
    optionsToggle.on("click", () => {
      const optionsVisiblity = this._engineUi.toggleOptions();
      this._bonfireUi.element.toggle(optionsVisiblity);
      this._spaceUi.element.toggle(optionsVisiblity);
      this._craftUi.element.toggle(optionsVisiblity);
      this._unlockUi.element.toggle(optionsVisiblity);
      this._tradingUi.element.toggle(optionsVisiblity);
      this._religionUi.element.toggle(optionsVisiblity);
      this._timeUi.element.toggle(optionsVisiblity);
      this._timeCtrlUi.element.toggle(optionsVisiblity);
      this._distributeUi.element.toggle(optionsVisiblity);
      this._optionsUi.element.toggle(optionsVisiblity);
      this._filterUi.element.toggle(optionsVisiblity);

      optionsToggle.text(optionsVisiblity ? "-" : "+");
      optionsToggle.prop(
        "title",
        optionsVisiblity ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    // collapse all options if the Enable Kitten Scientists label is shift-clicked
    this._engineUi.element.children("label").on("click", event => {
      if (!event.shiftKey) {
        return;
      }
      this._bonfireUi.toggleOptions(false);
      this._spaceUi.toggleOptions(false);
      this._craftUi.toggleOptions(false);
      this._unlockUi.toggleOptions(false);
      this._tradingUi.toggleOptions(false);
      this._religionUi.toggleOptions(false);
      this._timeUi.toggleOptions(false);
      this._timeCtrlUi.toggleOptions(false);
      this._distributeUi.toggleOptions(false);
      this._optionsUi.toggleOptions(false);
      this._filterUi.toggleOptions(false);
    });

    // Set up the "show activity summary" area.
    const activityBox = $("<div/>", {
      id: "activity-box",
      css: {
        display: "inline-block",
        verticalAlign: "bottom",
      },
    });

    const showActivity = $("<a/>", {
      id: "showActivityHref",
      text: "📝",
      title: this._host.i18n("summary.show"),
      href: "#",
    });

    showActivity.on("click", () => this._host.displayActivitySummary());

    activityBox.append(showActivity);

    $("#clearLog").prepend(activityBox);

    // add the options above the game log
    const right = $("#rightColumn");
    right.prepend(optionsElement.append(optionsListElement));
  }

  getState(): Options {
    const result = new Options();
    result.auto.engine = this._engineUi.getState();
    result.auto.bonfire = this._bonfireUi.getState();
    result.auto.space = this._spaceUi.getState();
    result.auto.craft = this._craftUi.getState();
    result.auto.unlock = this._unlockUi.getState();
    result.auto.trade = this._tradingUi.getState();
    result.auto.religion = this._religionUi.getState();
    result.auto.time = this._timeUi.getState();
    result.auto.timeCtrl = this._timeCtrlUi.getState();
    result.auto.village = this._distributeUi.getState();
    result.auto.options = this._optionsUi.getState();
    result.auto.filters = this._filterUi.getState();
    return result;
  }

  setState(state: Options): void {
    this._engineUi.setState(state.auto.engine);
    this._bonfireUi.setState(state.auto.bonfire);
    this._spaceUi.setState(state.auto.space);
    this._craftUi.setState(state.auto.craft);
    this._unlockUi.setState(state.auto.unlock);
    this._tradingUi.setState(state.auto.trade);
    this._religionUi.setState(state.auto.religion);
    this._timeUi.setState(state.auto.time);
    this._timeCtrlUi.setState(state.auto.timeCtrl);
    this._distributeUi.setState(state.auto.village);
    this._optionsUi.setState(state.auto.options);
    this._filterUi.setState(state.auto.filters);
  }

  refreshUi(): void {
    this._engineUi.refreshUi();
    this._bonfireUi.refreshUi();
    this._spaceUi.refreshUi();
    this._craftUi.refreshUi();
    this._unlockUi.refreshUi();
    this._tradingUi.refreshUi();
    this._religionUi.refreshUi();
    this._timeUi.refreshUi();
    this._timeCtrlUi.refreshUi();
    this._distributeUi.refreshUi();
    this._optionsUi.refreshUi();
    this._filterUi.refreshUi();
  }

  private _installCss(): void {
    // This development panel overlays the UI in the Sleek theme.
    this._addRule("#devPanel { display: none !important; }");

    // Basic layout for our own list-based options menus.
    this._addRule("#ks-options ul { list-style: none; margin: 0 0 5px; padding: 0; }");
    this._addRule('#ks-options ul:after { clear: both; content: " "; display: block; height: 0; }');
    this._addRule("#ks-options ul li { display: block; float: left; width: 100%; }");

    // Rules needed to enable stock warning.
    this._addRule(`
      #ks-options #toggle-list-resources .stockWarn *,
      #ks-options #toggle-reset-list-resources .stockWarn * {
        color: #DD1E00;
      }`);

    // Ensure the right column gets a scrollbar, when our content extends it too far down.
    this._addRule("body #gamePageContainer #game #rightColumn { overflow-y: auto }");
  }

  private _addRule(rule: string) {
    const styleSheetId = "kitten-scientists-styles";
    let styleSheet = document.getElementById(styleSheetId) as HTMLStyleElement;
    if (isNil(styleSheet)) {
      styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      document.head.appendChild(styleSheet);
    }
    const sheet = mustExist(styleSheet.sheet);
    sheet.insertRule(rule);
  }
}
