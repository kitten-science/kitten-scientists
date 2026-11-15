import type { SupportedLocale } from "../../Engine.js";
import type {
	SettingOptions,
	SettingTriggerMaxMin,
} from "../../settings/Settings.js";
import stylesButton from "./Button.module.css";
import stylesMinButton from "./buttons/MinButton.module.css";
import { TriggerButton } from "./buttons/TriggerButton.js";
import {
	SettingMaxMinListItem,
	type SettingMaxMinListItemOptions,
} from "./SettingMaxMinListItem.js";
import type { SettingTriggerListItemOptions } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingMaxMinTriggerListItemOptions =
	ThisType<SettingMaxMinTriggerListItem> &
		SettingMaxMinListItemOptions &
		SettingTriggerListItemOptions & {
			readonly renderLabelTrigger?: boolean;
		};

export class SettingMaxMinTriggerListItem extends SettingMaxMinListItem<SettingTriggerMaxMin> {
	declare readonly options: SettingMaxMinTriggerListItemOptions;
	readonly triggerButton: TriggerButton;

	constructor(
		parent: UiComponent,
		setting: SettingTriggerMaxMin,
		locale: SettingOptions<SupportedLocale>,
		label: string,
		options: SettingMaxMinTriggerListItemOptions,
	) {
		super(parent, setting, label, options);

		this.minButton.element.addClass(stylesMinButton.distance);

		this.triggerButton = new TriggerButton(parent, setting, locale, {
			border: false,
			classes: [stylesButton.lastHeadAction],
			onClick: async () => {
				await options.onSetTrigger.call(this);
			},
			onRefresh: options?.onRefreshTrigger
				? () => options.onRefreshTrigger?.call(this)
				: undefined,
			renderLabel: options?.renderLabelTrigger ?? true,
		});

		this.addChildrenHead([this.triggerButton]);
	}

	toString(): string {
		return `[${SettingMaxMinTriggerListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
	}
}
