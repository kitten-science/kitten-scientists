import { PolicySettingsUi } from "./PolicySettingsUi.js";
import { TechSettingsUi } from "./TechSettingsUi.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export class ScienceSettingsUi extends SettingsPanel {
  _policiesUi;
  _techsUi;
  _observeStars;
  constructor(host, settings, locale) {
    const label = host.engine.i18n("ui.upgrade");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
        },
        onRefresh: _item => {
          this.expando.ineffective =
            settings.enabled &&
            !settings.policies.enabled &&
            !settings.techs.enabled &&
            !settings.observe.enabled;
        },
      }),
    );
    this._policiesUi = new PolicySettingsUi(host, settings.policies, locale, settings, {
      onCheck: () => {
        this.refreshUi();
      },
      onUnCheck: () => {
        this.refreshUi();
      },
    });
    this._techsUi = new TechSettingsUi(host, settings.techs, locale, settings, {
      onCheck: () => {
        this.refreshUi();
      },
      onUnCheck: () => {
        this.refreshUi();
      },
    });
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
  refreshUi() {
    super.refreshUi();
    if (this.setting.observe.enabled) {
      $("#observeButton").hide();
    } else {
      $("#observeButton").show();
    }
  }
}
//# sourceMappingURL=ScienceSettingsUi.js.map
