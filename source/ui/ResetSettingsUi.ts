import type { SupportedLocale } from "../Engine.js";
import type { ResetSettings } from "../settings/ResetSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi.js";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi.js";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi.js";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi.js";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi.js";
import { ResetUpgradesSettingsUi } from "./ResetUpgradesSettingsUi.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetSettingsUi extends SettingsPanel<ResetSettings> {
  private readonly _bonfireUi: ResetBonfireSettingsUi;
  private readonly _religionUi: ResetReligionSettingsUi;
  private readonly _resourcesUi: ResetResourcesSettingsUi;
  private readonly _spaceUi: ResetSpaceSettingsUi;
  private readonly _timeUi: ResetTimeSettingsUi;
  private readonly _upgradesUi: ResetUpgradesSettingsUi;

  constructor(
    parent: UiComponent,
    settings: ResetSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("option.time.reset");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
      }),
      options,
    );

    const list = new SettingsList(parent, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._bonfireUi = new ResetBonfireSettingsUi(parent, this.setting.bonfire, locale);
    this._religionUi = new ResetReligionSettingsUi(parent, this.setting.religion, locale);
    this._resourcesUi = new ResetResourcesSettingsUi(parent, this.setting.resources, locale);
    this._spaceUi = new ResetSpaceSettingsUi(parent, this.setting.space, locale);
    this._timeUi = new ResetTimeSettingsUi(parent, this.setting.time, locale);
    this._upgradesUi = new ResetUpgradesSettingsUi(parent, this.setting.upgrades, locale);

    list.addChildren([
      this._bonfireUi,
      this._religionUi,
      this._resourcesUi,
      this._spaceUi,
      this._timeUi,
      this._upgradesUi,
    ]);
    this.addChild(list);
  }
}
