import type { SettingMin } from "../../settings/Settings.js";
import { MinButton } from "./buttons/MinButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import {
	SettingListItem,
	type SettingListItemOptions,
} from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingMinListItemOptions = ThisType<SettingMinListItem> &
	SettingListItemOptions & {
		readonly onRefreshMin?: () => void;
		readonly onSetMin: () => void | Promise<void>;
	};

export class SettingMinListItem extends SettingListItem<SettingMin> {
	declare readonly options: SettingMinListItemOptions;
	readonly minButton: MinButton;

	/**
	 * Create a UI element for a setting that can have a minimum.
	 * This will result in an element with a labeled checkbox and a "Min" indicator,
	 * which controls the respective `min` property in the setting model.
	 *
	 * @param host The userscript instance.
	 * @param label The label for the setting.
	 * @param setting The setting model.
	 * @param options Options for the list item.
	 */
	constructor(
		parent: UiComponent,
		setting: SettingMin,
		label: string,
		options: SettingMinListItemOptions,
	) {
		super(parent, setting, label, options);

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
		]);
	}

	toString(): string {
		return `[${SettingMinListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
	}
}
