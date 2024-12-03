import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { ScienceSettings } from "../settings/ScienceSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class ScienceSettingsUi extends SettingsPanel<ScienceSettings> {
  private readonly _items: Array<SettingListItem>;
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  protected readonly _observeStars: SettingListItem;

  constructor(
    host: KittenScientists,
    settings: ScienceSettings,
    language: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.upgrade");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    this._policiesUi = new PolicySettingsUi(host, this.setting.policies, language);
    this._techsUi = new TechSettingsUi(host, this.setting.techs, language);

    this._observeStars = new SettingListItem(
      host,
      host.engine.i18n("option.observe"),
      this.setting.observe,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.observe")]);
          this.refreshUi();
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.observe")]);
          this.refreshUi();
        },
      },
    );

    this._items = [this._policiesUi, this._techsUi, this._observeStars];

    const itemsList = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    itemsList.addChildren([this._techsUi, this._policiesUi, this._observeStars]);
    this.addChild(itemsList);
  }

  override refreshUi(): void {
    super.refreshUi();

    if (this.setting.observe.enabled) {
      $("#observeButton").hide();
    } else {
      $("#observeButton").show();
    }
  }
}
