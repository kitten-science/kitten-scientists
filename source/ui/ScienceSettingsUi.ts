import type { SupportedLocale } from "../Engine.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ScienceSettingsUi extends SettingsPanel<ScienceSettings> {
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  private readonly _observeStars: SettingListItem;

  constructor(
    parent: UiComponent,
    settings: ScienceSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: () => {
          this.expando.ineffective =
            settings.enabled &&
            !settings.policies.enabled &&
            !settings.techs.enabled &&
            !settings.observe.enabled;
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
    );

    this._policiesUi = new PolicySettingsUi(this, settings.policies, locale, settings);
    this._techsUi = new TechSettingsUi(this, settings.techs, locale, settings);

    this._observeStars = new SettingListItem(
      this,
      this.setting.observe,
      this.host.engine.i18n("option.observe"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [this.host.engine.i18n("option.observe")]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [
            this.host.engine.i18n("option.observe"),
          ]);
        },
      },
    );

    const itemsList = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    itemsList.addChildren([this._techsUi, this._policiesUi, this._observeStars]);
    this.addChildContent(itemsList);
  }

  refreshUi(): void {
    super.refreshUi();

    if (this.setting.observe.enabled) {
      $("#observeButton").hide();
    } else {
      $("#observeButton").show();
    }
  }
}
