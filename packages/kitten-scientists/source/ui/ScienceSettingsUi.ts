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
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  protected readonly _observeStars: SettingListItem;

  constructor(
    host: KittenScientists,
    settings: ScienceSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.upgrade");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    this._policiesUi = new PolicySettingsUi(host, this.setting.policies, locale);
    this._techsUi = new TechSettingsUi(host, this.setting.techs, locale);

    this._observeStars = new SettingListItem(
      host,
      this.setting.observe,
      host.engine.i18n("option.observe"),
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
