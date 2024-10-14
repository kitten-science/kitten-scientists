import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { ScienceSettings } from "../settings/ScienceSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ScienceSettingsUi extends AbstractBuildSettingsPanel<ScienceSettings> {
  private readonly _items: Array<SettingListItem>;
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  protected readonly _observeStars: SettingListItem;

  constructor(
    host: KittenScientists,
    settings: ScienceSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("ui.upgrade");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    this._policiesUi = new PolicySettingsUi(this._host, this.setting.policies, language);
    this._techsUi = new TechSettingsUi(this._host, this.setting.techs, language);

    this._observeStars = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.observe"),
      this.setting.observe,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.observe"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.observe"),
          ]);
        },
      },
    );

    this._items = [this._policiesUi, this._techsUi, this._observeStars];

    const itemsList = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    itemsList.addChildren([this._techsUi, this._policiesUi, this._observeStars]);
    this.addChild(itemsList);
  }
}
