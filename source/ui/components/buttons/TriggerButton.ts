import type { SupportedLocale } from "../../../Engine.js";
import { Icons } from "../../../images/Icons.js";
import type {
	SettingOptions,
	SettingThreshold,
	SettingTrigger,
} from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import type { UiComponent } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = ThisType<TriggerButton> &
	ButtonOptions & {
		readonly renderLabel?: boolean;
	};

export class TriggerButton extends Button {
	declare readonly options: TriggerButtonOptions;
	readonly setting: SettingTrigger | SettingThreshold;

	/**
	 * How this button's value is currently interpreted.
	 *
	 * This follows the setting, not its class: the same trigger can be given
	 * either as a share of a maximum or as an absolute value, and the user picks
	 * the mode with the input itself.
	 */
	get behavior(): TriggerButtonBehavior {
		return this.setting.isPercentage ? "percentage" : "integer";
	}

	constructor(
		parent: UiComponent,
		setting: SettingTrigger | SettingThreshold,
		_locale: SettingOptions<SupportedLocale>,
		options: TriggerButtonOptions,
	) {
		super(parent, "", Icons.Trigger, {
			...options,
			onRefresh: () => {
				const triggerValue =
					this.behavior === "integer"
						? this.host.renderAbsolute(this.setting.trigger, "invariant")
						: this.host.renderPercentage(
								this.setting.trigger,
								"invariant",
								true,
							);

				this.updateTitle(this.host.engine.i18n("ui.trigger", [triggerValue]));
				if (this.options?.renderLabel ?? true) {
					this.updateLabel(triggerValue);
				}

				// Let the owner recompute `inactive` (and the tooltip) *before* the
				// styling is applied. Applying it first would leave the button
				// looking inactive until the next refresh.
				options?.onRefresh?.call(this);

				if (!this.inactive) {
					this.element.removeClass(stylesButton.inactive);
				} else {
					this.element.addClass(stylesButton.inactive);
				}
			},
		});

		this.setting = setting;
	}

	toString(): string {
		return `[${TriggerButton.name}#${this.componentId}]`;
	}
}
