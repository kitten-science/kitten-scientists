import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { PolicySettings } from "../settings/PolicySettings.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { objectEntries } from "../tools/Entries.js";
import stylesButton from "./components/Button.module.css";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class PolicySettingsUi extends SettingsPanel<
	PolicySettings,
	SettingTriggerListItem
> {
	constructor(
		parent: UiComponent,
		settings: PolicySettings,
		locale: SettingOptions<SupportedLocale>,
		sectionSetting: ScienceSettings,
	) {
		const label = parent.host.engine.i18n("ui.upgrade.policies");
		super(
			parent,
			settings,
			new SettingTriggerListItem(parent, settings, locale, label, {
				onCheck: (_isBatchProcess?: boolean) => {
					parent.host.engine.imessage("status.auto.enable", [label]);
				},
				onRefreshTrigger() {
					this.triggerButton.element[0].title = parent.host.engine.i18n(
						"ui.trigger",
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
						!settings.enabled || settings.trigger === -1;
					this.settingItem.triggerButton.ineffective =
						sectionSetting.enabled &&
						settings.enabled &&
						settings.trigger === -1 &&
						!Object.values(settings.policies).some(
							(policy) => policy.enabled && 0 <= policy.trigger,
						);

					this.expando.ineffective =
						sectionSetting.enabled &&
						settings.enabled &&
						!Object.values(settings.policies).some((policy) => policy.enabled);
				},
			},
		);

		const policies = this.host.game.science.policies.filter(
			(policy) => !isNil(this.setting.policies[policy.name]),
		);

		const items = [];
		let lastLabel = policies[0].label;
		for (const policy of policies.sort((a, b) =>
			a.label.localeCompare(b.label, locale.selected),
		)) {
			const option = this.setting.policies[policy.name];

			const element = new SettingTriggerListItem(
				this,
				option,
				locale,
				policy.label,
				{
					onCheck: () => {
						this.host.engine.imessage("status.sub.enable", [policy.label]);
					},
					onRefresh: () => {
						element.triggerButton.inactive =
							!option.enabled || option.trigger === -1;
						element.triggerButton.ineffective =
							sectionSetting.enabled &&
							settings.enabled &&
							option.enabled &&
							settings.trigger === -1 &&
							option.trigger === -1;
						element.element.toggleClass(
							stylesLabelListItem.researched,
							policy.researched,
						);
					},
					onRefreshTrigger: () => {
						element.triggerButton.element[0].title = this.host.engine.i18n(
							"ui.trigger",
							[
								option.trigger < 0
									? settings.trigger < 0
										? this.host.engine.i18n("ui.trigger.section.blocked", [
												label,
											])
										: `${this.host.renderPercentage(settings.trigger, locale.selected, true)} (${this.host.engine.i18n("ui.trigger.section.inherited")})`
									: this.host.renderPercentage(
											option.trigger,
											locale.selected,
											true,
										),
							],
						);
					},
					onSetTrigger: async () => {
						const value = await Dialog.prompt(
							this,
							this.host.engine.i18n("ui.trigger.prompt.percentage"),
							this.host.engine.i18n("ui.trigger.section.prompt", [
								label,
								option.trigger !== -1
									? this.host.renderPercentage(
											option.trigger,
											locale.selected,
											true,
										)
									: this.host.engine.i18n("ui.trigger.section.inherited"),
							]),
							option.trigger !== -1
								? this.host.renderPercentage(option.trigger)
								: "",
							this.host.engine.i18n("ui.trigger.section.promptExplainer"),
						);

						if (value === undefined) {
							return;
						}

						if (value === "" || value.startsWith("-")) {
							option.trigger = -1;
							return;
						}

						option.trigger = this.host.parsePercentage(value);
					},
					onUnCheck: () => {
						this.host.engine.imessage("status.sub.disable", [policy.label]);
					},
					renderLabelTrigger: false,
					title: [
						policy.description,
						...policy.prices.map((price) => `- ${price.name}: ${price.val}`),
						...objectEntries(policy.effects ?? {}).map(
							([effect, value]) => `+ ${effect}: ${value}`,
						),
					].join("\n"),
				},
			);
			element.triggerButton.element.addClass(stylesButton.lastHeadAction);

			if (this.host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
				if (lastLabel[0] !== policy.label[0]) {
					element.element.addClass(stylesLabelListItem.splitter);
				}
			}

			items.push(element);

			lastLabel = policy.label;
		}

		this.addChildContent(new SettingsList(this).addChildren(items));
	}
}
