import type { SupportedLocale } from "../Engine.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ScienceSettingsUi extends SettingsPanel<ScienceSettings> {
  private readonly _policiesUi: PolicySettingsUi;
  private readonly _techsUi: TechSettingsUi;
  private readonly _observeStars: SettingListItem;

  constructor(
    parent: UiComponent,
    settings: ScienceSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade");
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
        onRefresh: () => {
          this.expando.ineffective =
            settings.enabled &&
            !settings.policies.enabled &&
            !settings.techs.enabled &&
            !settings.observe.enabled;
        },
      }),
    );

    this._policiesUi = new PolicySettingsUi(parent, settings.policies, locale, settings, {
      onCheck: () => {
        this.refreshUi();
      },
      onUnCheck: () => {
        this.refreshUi();
      },
    });
    this._techsUi = new TechSettingsUi(parent, settings.techs, locale, settings, {
      onCheck: () => {
        this.refreshUi();
      },
      onUnCheck: () => {
        this.refreshUi();
      },
    });

    this._observeStars = new SettingListItem(
      parent,
      this.setting.observe,
      parent.host.engine.i18n("option.observe"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.observe"),
          ]);
          this.refreshUi();
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.observe"),
          ]);
          this.refreshUi();
        },
      },
    );

    const itemsList = new SettingsList(parent, {
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
