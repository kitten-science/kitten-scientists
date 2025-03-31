import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetSettings } from "../settings/ResetSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi.js";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi.js";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi.js";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi.js";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi.js";
import { ResetUpgradesSettingsUi } from "./ResetUpgradesSettingsUi.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class ResetSettingsUi extends SettingsPanel<ResetSettings> {
  private readonly _bonfireUi: ResetBonfireSettingsUi;
  private readonly _religionUi: ResetReligionSettingsUi;
  private readonly _resourcesUi: ResetResourcesSettingsUi;
  private readonly _spaceUi: ResetSpaceSettingsUi;
  private readonly _timeUi: ResetTimeSettingsUi;
  private readonly _upgradesUi: ResetUpgradesSettingsUi;

  constructor(
    host: KittenScientists,
    settings: ResetSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  ) {
    const label = host.engine.i18n("option.time.reset");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
      }),
      options,
    );

    const list = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._bonfireUi = new ResetBonfireSettingsUi(host, this.setting.bonfire, locale);
    this._religionUi = new ResetReligionSettingsUi(host, this.setting.religion, locale);
    this._resourcesUi = new ResetResourcesSettingsUi(host, this.setting.resources, locale);
    this._spaceUi = new ResetSpaceSettingsUi(host, this.setting.space, locale);
    this._timeUi = new ResetTimeSettingsUi(host, this.setting.time, locale);
    this._upgradesUi = new ResetUpgradesSettingsUi(host, this.setting.upgrades, locale);

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
