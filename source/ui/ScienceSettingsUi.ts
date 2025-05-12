import type { SupportedLocale } from "../Engine.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { cl } from "../tools/Log.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";
import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";

export class ScienceSettingsUi extends SettingsPanel<ScienceSettings> {
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  private readonly _observeStars: SettingListItem;

  constructor(
    parent: UiComponent,
    settings: ScienceSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    console.debug(...cl(`Constructing ${ScienceSettingsUi.name}`));

    const label = parent.host.engine.i18n("ui.upgrade");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (_isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },

        onUnCheck: (_isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
      {
        onRefresh: () => {
          if (this.setting.observe.enabled) {
            $("#observeButton").hide();
          } else {
            $("#observeButton").show();
          }
        },
        onRefreshRequest: () => {
          this.expando.ineffective =
            settings.enabled &&
            ((this.setting.policies.enabled && this._policiesUi.expando.ineffective) ||
              (this.setting.techs.enabled &&
                (this._techsUi.expando.ineffective ||
                  this._techsUi.settingItem.triggerButton.ineffective)));
        },
      },
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
}
