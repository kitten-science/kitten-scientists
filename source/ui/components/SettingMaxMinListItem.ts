import type { SettingMaxMin } from "../../settings/Settings.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { MinButton } from "./buttons/MinButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import {
	SettingListItem,
	type SettingListItemOptions,
} from "./SettingListItem.js";
import type { SettingMaxListItemOptions } from "./SettingMaxListItem.js";
import stylesSettingMaxMinListItem from "./SettingMaxMinListItem.module.css";
import type { SettingMinListItemOptions } from "./SettingMinListItem.js";
import { Span } from "./Span.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingMaxMinListItemOptions<
	TSetting extends SettingMaxMin = SettingMaxMin,
> = ThisType<SettingMaxMinListItem<TSetting>> &
	SettingListItemOptions &
	SettingMaxListItemOptions &
	SettingMinListItemOptions;

export class SettingMaxMinListItem<
	TSetting extends SettingMaxMin = SettingMaxMin,
> extends SettingListItem<TSetting> {
	declare readonly options: SettingMaxMinListItemOptions;
	readonly maxButton: MaxButton;
	readonly minButton: MinButton;

	/**
	 * Create a UI element for a setting that can have a maximum, and a minimum.
	 * This will result in an element with a labeled checkbox and a "Max" and "Min" indicator,
	 * which control the respective `max` and `min` properties in the setting model.
	 *
	 * @param host The userscript instance.
	 * @param label The label for the setting.
	 * @param setting The setting model.
	 * @param options Options for the list item.
	 */
	constructor(
		parent: UiComponent,
		setting: TSetting,
		label: string,
		options: SettingMaxMinListItemOptions,
	) {
		super(parent, setting, label, options);

		this.maxButton = new MaxButton(parent, setting, {
			border: false,
			onClick: async () => {
				await options.onSetMax.call(this);
			},
			onRefresh: options?.onRefreshMax
				? () => options.onRefreshMax?.call(this)
				: undefined,
		});
		this.minButton = new MinButton(parent, setting, {
			border: false,
			onClick: async () => {
				await options.onSetMin.call(this);
			},
			onRefresh: options?.onRefreshMin
				? () => options.onRefreshMin?.call(this)
				: undefined,
		});
		this.addChildrenHead([
			new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
			this.minButton,
			new Span(parent, "-", {
				classes: [stylesSettingMaxMinListItem.distance],
			}),
			this.maxButton,
		]);
	}

	toString(): string {
		return `[${SettingMaxMinListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
	}
}
