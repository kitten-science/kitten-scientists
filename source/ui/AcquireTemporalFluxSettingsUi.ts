import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type {
	AcquireTemporalFluxSettings,
	TimeSkipSettings,
} from "../settings/TimeSkipSettings.js";
import { parsePercentageEntry } from "../tools/Numbers.js";
import { renderTrigger } from "../tools/TriggerValue.js";
import stylesButton from "./components/Button.module.css";
import { MaxButton } from "./components/buttons/MaxButton.js";
import { Dialog } from "./components/Dialog.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

/**
 * Settings for the automatic acquisition of temporal flux.
 *
 * The trigger value can be filled in with the maximum temporal flux storage the
 * game currently reports, and the acquisition can be told to keep burning time
 * crystals while the chrono heat capacity is exhausted.
 */
export class AcquireTemporalFluxSettingsUi extends SettingsPanel<
	AcquireTemporalFluxSettings,
	SettingTriggerListItem<AcquireTemporalFluxSettings>
> {
	readonly maxButton: MaxButton;

	constructor(
		parent: UiComponent,
		settings: AcquireTemporalFluxSettings,
		locale: SettingOptions<SupportedLocale>,
		sectionSetting: TimeSkipSettings,
		sectionParentSetting: TimeControlSettings,
	) {
		const label = parent.host.engine.i18n(
			"option.time.skip.acquireTemporalFlux",
		);
		super(
			parent,
			settings,
			new SettingTriggerListItem(parent, settings, locale, label, {
				onCheck: (_isBatchProcess?: boolean) => {
					parent.host.engine.imessage("status.sub.enable", [label]);
				},
				onRefreshTrigger() {
					this.triggerButton.inactive = !settings.enabled;
					this.triggerButton.ineffective =
						sectionParentSetting.enabled &&
						sectionSetting.enabled &&
						settings.enabled &&
						settings.trigger <= 0;
					this.triggerButton.element[0].title = parent.host.engine.i18n(
						"ui.trigger.acquireTemporalFlux.title",
						[
							renderTrigger(
								parent.host,
								settings.trigger,
								settings.isPercentage,
								locale.selected,
							),
						],
					);
				},
				onSetTrigger: async () => {
					const value = await Dialog.prompt(
						parent,
						parent.host.engine.i18n("ui.trigger.acquireTemporalFlux.prompt"),
						parent.host.engine.i18n(
							"ui.trigger.acquireTemporalFlux.promptTitle",
							[
								renderTrigger(
									parent.host,
									settings.trigger,
									settings.isPercentage,
									locale.selected,
								),
							],
						),
						renderTrigger(
							parent.host,
							settings.trigger,
							settings.isPercentage,
							"invariant",
						),
						parent.host.engine.i18n(
							"ui.trigger.acquireTemporalFlux.promptExplainer",
						),
					);

					if (value === undefined || value === "") {
						return;
					}

					// A trailing percentage sign switches this trigger to a share of the
					// maximum temporal flux storage, an absolute value switches it back.
					// Input that isn't a number at all is treated like hitting cancel, as
					// the explainer of this prompt promises.
					const entry = parsePercentageEntry(value);
					if (entry === null || entry.kind === "invalid") {
						return;
					}

					settings.isPercentage = entry.kind === "percentage";
					settings.trigger = entry.value;
				},
				onUnCheck: (_isBatchProcess?: boolean) => {
					parent.host.engine.imessage("status.sub.disable", [label]);
				},
			}),
			{
				onRefreshRequest: () => {
					this.maxButton.inactive = !settings.enabled;
					this.maxButton.ineffective =
						sectionParentSetting.enabled &&
						sectionSetting.enabled &&
						settings.enabled &&
						this.detectedMaximum() <= 0;
				},
			},
		);

		this.maxButton = new MaxButton(parent, settings, {
			alignment: "right",
			border: false,
			classes: [stylesButton.headAction],
			onClick: async () => {
				const maximum = this.detectedMaximum();
				const value = await Dialog.prompt(
					parent,
					parent.host.engine.i18n("ui.max.acquireTemporalFlux.prompt"),
					parent.host.engine.i18n("ui.max.acquireTemporalFlux.promptTitle", [
						parent.host.renderAbsolute(maximum, locale.selected),
					]),
					parent.host.renderAbsolute(maximum),
					parent.host.engine.i18n("ui.max.acquireTemporalFlux.promptExplainer"),
				);

				if (value === undefined || value === "") {
					return;
				}

				// The same syntax as in the trigger dialog is accepted, so the value
				// that was just filled in (an absolute amount) keeps working even if
				// the user edits it into a share of the maximum.
				const entry = parsePercentageEntry(value);
				if (entry === null || entry.kind === "invalid") {
					return;
				}

				settings.isPercentage = entry.kind === "percentage";
				settings.trigger = entry.value;
			},
			onRefresh: () => {
				const maximum = this.detectedMaximum();
				this.maxButton.updateLabel(parent.host.renderAbsolute(maximum));
				this.maxButton.updateTitle(
					parent.host.engine.i18n("ui.max.acquireTemporalFlux.title", [
						parent.host.renderAbsolute(maximum, locale.selected),
					]),
				);
			},
		});
		// The button belongs in front of the trigger button, which is where the
		// limiter of a setting sits everywhere else.
		this.settingItem.addChildHead(this.maxButton);
		this.settingItem.triggerButton.element.before(this.maxButton.element);

		this.addChildContent(
			new SettingsList(this, {
				hasDisableAll: false,
				hasEnableAll: false,
			}).addChildren([
				new SettingListItem(
					this,
					settings.ignoreOverheat,
					this.host.engine.i18n(
						"option.time.skip.acquireTemporalFlux.ignoreOverheat",
					),
				),
			]),
		);
	}

	/**
	 * The maximum temporal flux storage the game currently reports.
	 *
	 * The game doesn't report a maximum for temporal flux while the player has no
	 * storage for it, which is reported as 0 here.
	 *
	 * This is only evaluated when the interface is refreshed. The time control
	 * manager requests a refresh whenever the reported maximum changes, and the
	 * button reads the value again when it is used.
	 *
	 * @returns The current maximum temporal flux.
	 */
	detectedMaximum(): number {
		const maximum = this.host.game.resPool.get("temporalFlux").maxValue;
		return Number.isFinite(maximum) && 0 < maximum ? maximum : 0;
	}
}
