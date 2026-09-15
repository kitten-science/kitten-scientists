import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeItem, TimeSettings } from "../settings/TimeSettings.js";
import { isTemporalFluxProduced } from "../TimeManager.js";
import { objectEntries } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { CollapsiblePanel } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class TimeSettingsUi extends SettingsPanel<
	TimeSettings,
	SettingTriggerListItem
> {
	private readonly _fixCryochambers: CollapsiblePanel;

	constructor(
		parent: UiComponent,
		settings: TimeSettings,
		locale: SettingOptions<SupportedLocale>,
	) {
		console.debug(...cl(`Constructing ${TimeSettingsUi.name}`));

		const label = parent.host.engine.i18n("ui.time");
		super(
			parent,
			settings,
			new SettingTriggerListItem(parent, settings, locale, label, {
				onCheck: (_isBatchProcess?: boolean) => {
					parent.host.engine.imessage("status.auto.enable", [label]);
				},
				onRefresh: () => {
					this.settingItem.triggerButton.inactive =
						!settings.enabled || settings.trigger === -1;
				},
				onRefreshTrigger() {
					this.triggerButton.element[0].title = parent.host.engine.i18n(
						"ui.trigger.section",
						[
							settings.trigger < 0
								? parent.host.engine.i18n("ui.trigger.section.inactive")
								: parent.host.renderPercentage(
										settings.trigger,
										locale.selected,
										true,
									),
						],
					);
				},
				onSetTrigger: async () => {
					const value = await Dialog.prompt(
						parent,
						parent.host.engine.i18n("ui.trigger.prompt.percentage"),
						parent.host.engine.i18n("ui.trigger.section.prompt", [
							label,
							settings.trigger !== -1
								? parent.host.renderPercentage(
										settings.trigger,
										locale.selected,
										true,
									)
								: parent.host.engine.i18n("ui.infinity"),
						]),
						settings.trigger !== -1
							? parent.host.renderPercentage(settings.trigger)
							: "",
						parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
					);

					if (value === undefined) {
						return;
					}

					if (value === "" || value.startsWith("-")) {
						settings.trigger = -1;
						return;
					}

					settings.trigger = parent.host.parsePercentage(value);
				},
				onUnCheck: (_isBatchProcess?: boolean) => {
					parent.host.engine.imessage("status.auto.disable", [label]);
				},
				renderLabelTrigger: false,
			}),
			{
				onRefreshRequest: () => {
					this.settingItem.triggerButton.inactive =
						!settings.enabled || settings.trigger < 0;
					this.settingItem.triggerButton.ineffective =
						settings.enabled &&
						settings.trigger < 0 &&
						Object.values(settings.buildings).some(
							(_) => _.enabled && 0 < _.max && _.trigger < 0,
						);

					this.expando.ineffective =
						settings.enabled &&
						Object.values(settings.buildings).some(
							(_) =>
								_.enabled &&
								(0 === _.max || (_.trigger < 0 && settings.trigger < 0)),
						);

					// Flag the sub-menu while the configured gate cannot be met.
					this._fixCryochambers.expando.ineffective =
						settings.enabled &&
						settings.fixCryochambers.enabled &&
						settings.fixCryochambers.onlyWithFluxProduction.enabled &&
						!isTemporalFluxProduced(this.host);
				},
			},
		);

		this._fixCryochambers = new CollapsiblePanel(
			this,
			new SettingTriggerListItem(
				this,
				this.setting.fixCryochambers,
				locale,
				this.host.engine.i18n("option.fix.cry"),
				{
					onCheck: () => {
						this.host.engine.imessage("status.sub.enable", [
							this.host.engine.i18n("option.fix.cry"),
						]);
					},
					onRefreshTrigger() {
						this.triggerButton.inactive =
							!this.setting.enabled || this.setting.trigger <= 0;
						this.triggerButton.element[0].title = this.host.engine.i18n(
							"ui.trigger.fixCryochambers.title",
							[
								this.setting.trigger <= 0
									? this.host.engine.i18n("ui.trigger.inactive")
									: this.host.renderAbsolute(
											this.setting.trigger,
											locale.selected,
										),
							],
						);
					},
					onSetTrigger: async () => {
						const value = await Dialog.prompt(
							this,
							this.host.engine.i18n("ui.trigger.prompt.float"),
							this.host.engine.i18n("ui.trigger.fixCryochambers.promptTitle", [
								this.host.renderAbsolute(
									this.setting.fixCryochambers.trigger,
									locale.selected,
								),
							]),
							this.host.renderAbsolute(this.setting.fixCryochambers.trigger),
							this.host.engine.i18n(
								"ui.trigger.fixCryochambers.promptExplainer",
							),
						);

						if (value === undefined) {
							return;
						}

						// An empty or negative value disables the limit.
						if (value === "" || value.startsWith("-")) {
							this.setting.fixCryochambers.trigger = 0;
							return;
						}

						this.setting.fixCryochambers.trigger =
							this.host.parseAbsolute(value) ??
							this.setting.fixCryochambers.trigger;
					},
					onUnCheck: () => {
						this.host.engine.imessage("status.sub.disable", [
							this.host.engine.i18n("option.fix.cry"),
						]);
					},
				},
			),
		);

		// The sub-menu of the cryochamber repair: only repair while temporal flux
		// is actually being produced.
		const onlyWithFluxProduction = new SettingListItem(
			this,
			this.setting.fixCryochambers.onlyWithFluxProduction,
			this.host.engine.i18n("option.fix.cry.onlyWithFluxProduction"),
			{
				onCheck: () => {
					this.host.engine.imessage("status.sub.enable", [
						this.host.engine.i18n("option.fix.cry.onlyWithFluxProduction"),
					]);
				},
				onUnCheck: () => {
					this.host.engine.imessage("status.sub.disable", [
						this.host.engine.i18n("option.fix.cry.onlyWithFluxProduction"),
					]);
				},
			},
		);
		onlyWithFluxProduction.element[0].title = this.host.engine.i18n(
			"ui.option.fix.cry.onlyWithFluxProduction.title",
		);
		this._fixCryochambers.addChildContent(
			new SettingsList(this, {
				hasDisableAll: false,
				hasEnableAll: false,
			}).addChildren([onlyWithFluxProduction]),
		);

		this.addChildrenContent([
			new SettingsList(this).addChildren([
				new HeaderListItem(
					this,
					this.host.engine.i18n("$workshop.chronoforge.label"),
				),
				...this.host.game.time.chronoforgeUpgrades
					.filter((item) => !isNil(this.setting.buildings[item.name]))
					.map((building) =>
						BuildSectionTools.getBuildOptionWithMax(
							this,
							this.setting.buildings[building.name],
							locale,
							this.setting,
							building.label,
							label,
							{
								delimiter:
									building.name ===
									this.host.game.time.chronoforgeUpgrades.at(-1)?.name,
								renderLabelTrigger: false,
								title: [
									building.description,
									...(building.prices ?? []).map(
										(price) => `- ${price.name}: ${price.val}`,
									),
									...objectEntries(building.effects ?? {}).map(
										([effect, value]) => `+ ${effect}: ${value}`,
									),
									building.unlocked ? "is unlocked" : "still locked",
								].join("\n"),
							},
						),
					),

				new HeaderListItem(
					this,
					this.host.engine.i18n("$science.voidSpace.label"),
				),
				...this.host.game.time.voidspaceUpgrades
					.filter((item) => item.name in this.setting.buildings)
					.map((building) =>
						BuildSectionTools.getBuildOptionWithMax(
							this,
							this.setting.buildings[building.name as TimeItem],
							locale,
							this.setting,
							building.label,
							label,
							{
								renderLabelTrigger: false,
								title: [
									building.description,
									...(building.prices ?? []).map(
										(price) => `- ${price.name}: ${price.val}`,
									),
									...objectEntries(building.effects ?? {}).map(
										([effect, value]) => `+ ${effect}: ${value}`,
									),
									building.unlocked ? "is unlocked" : "still locked",
								].join("\n"),
							},
						),
					),
			]),

			new SettingsList(this, {
				hasDisableAll: false,
				hasEnableAll: false,
			}).addChildren([
				new HeaderListItem(this, this.host.engine.i18n("ui.additional")),
				this._fixCryochambers,
			]),
		]);
	}
}
