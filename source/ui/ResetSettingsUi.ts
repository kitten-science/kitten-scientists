import type { SupportedLocale } from "../Engine.js";
import type { ResetSettings } from "../settings/ResetSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi.js";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi.js";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi.js";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi.js";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi.js";
import { ResetUpgradesSettingsUi } from "./ResetUpgradesSettingsUi.js";

export class ResetSettingsUi extends SettingsPanel<ResetSettings> {
	private readonly _bonfireUi: ResetBonfireSettingsUi;
	private readonly _religionUi: ResetReligionSettingsUi;
	private readonly _resourcesUi: ResetResourcesSettingsUi;
	private readonly _spaceUi: ResetSpaceSettingsUi;
	private readonly _timeUi: ResetTimeSettingsUi;
	private readonly _upgradesUi: ResetUpgradesSettingsUi;
	private readonly _stockpileUi: SettingTriggerListItem;

	constructor(
		parent: UiComponent,
		settings: ResetSettings,
		locale: SettingOptions<SupportedLocale>,
		sectionSetting: TimeControlSettings,
	) {
		const label = parent.host.engine.i18n("option.time.reset");
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
			}).addChildrenHead([
				new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
			]),
			{
				onRefreshRequest: () => {
					this.expando.ineffective =
						sectionSetting.enabled &&
						settings.enabled &&
						([
							this._bonfireUi,
							this._religionUi,
							this._resourcesUi,
							this._spaceUi,
							this._timeUi,
							this._upgradesUi,
						].some((_) => _.expando.ineffective) ||
							(!Object.values(this.setting.bonfire.buildings).some(
								(_) => _.enabled,
							) &&
								!Object.values(this.setting.religion.buildings).some(
									(_) => _.enabled,
								) &&
								!Object.values(this.setting.resources.resources).some(
									(_) => _.enabled,
								) &&
								!Object.values(this.setting.space.buildings).some(
									(_) => _.enabled,
								) &&
								!Object.values(this.setting.time.buildings).some(
									(_) => _.enabled,
								) &&
								!Object.values(this.setting.upgrades.upgrades).some(
									(_) => _.enabled,
								)));
				},
			},
		);

		const list = new SettingsList(this, {
			hasDisableAll: false,
			hasEnableAll: false,
		});
		this._bonfireUi = new ResetBonfireSettingsUi(
			this,
			this.setting.bonfire,
			locale,
			this.setting,
		);
		this._religionUi = new ResetReligionSettingsUi(
			this,
			this.setting.religion,
			locale,
			this.setting,
		);
		this._resourcesUi = new ResetResourcesSettingsUi(
			this,
			this.setting.resources,
			locale,
		);
		this._spaceUi = new ResetSpaceSettingsUi(
			this,
			this.setting.space,
			locale,
			this.setting,
		);
		this._timeUi = new ResetTimeSettingsUi(
			this,
			this.setting.time,
			locale,
			this.setting,
		);
		this._upgradesUi = new ResetUpgradesSettingsUi(
			this,
			this.setting.upgrades,
			locale,
		);

		const stockpileLabel = this.host.engine.i18n("option.time.reset.stockpile");
		this._stockpileUi = new SettingTriggerListItem(
			this,
			this.setting.stockpile,
			locale,
			stockpileLabel,
			{
				onCheck: () => {
					this.host.engine.imessage("status.sub.enable", [stockpileLabel]);
				},
				onRefresh: () => {
					this._stockpileUi.triggerButton.inactive =
						!this.setting.stockpile.enabled;
				},
				onSetTrigger: async () => {
					const value = await Dialog.prompt(
						this,
						this.host.engine.i18n("ui.trigger.reset.stockpile.prompt"),
						this.host.engine.i18n("ui.trigger.reset.stockpile.promptTitle", [
							this.host.renderPercentage(
								this.setting.stockpile.trigger,
								locale.selected,
								true,
							),
						]),
						this.host.renderPercentage(this.setting.stockpile.trigger),
						this.host.engine.i18n("ui.trigger.reset.stockpile.promptExplainer"),
					);

					if (value === undefined || value === "" || value.startsWith("-")) {
						return;
					}

					this.setting.stockpile.trigger = this.host.parsePercentage(value);
				},
				onUnCheck: () => {
					this.host.engine.imessage("status.sub.disable", [stockpileLabel]);
				},
			},
		);
		this._stockpileUi.triggerButton.element.addClass(
			stylesButton.lastHeadAction,
		);

		list.addChildren([
			this._stockpileUi,
			this._bonfireUi,
			this._religionUi,
			this._resourcesUi,
			this._spaceUi,
			this._timeUi,
			this._upgradesUi,
		]);
		this.addChildContent(list);
	}
}
