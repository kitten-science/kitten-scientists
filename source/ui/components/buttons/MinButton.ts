import type { SettingMin } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import type { UiComponent } from "../UiComponent.js";
import styles from "./MinButton.module.css";

export type MinButtonOptions = ThisType<MinButton> & ButtonOptions;

export class MinButton extends Button {
	declare readonly options: MinButtonOptions;
	readonly setting: SettingMin;

	constructor(
		parent: UiComponent,
		setting: SettingMin,
		options: MinButtonOptions,
	) {
		super(parent, "", null, {
			...options,
			classes: [styles.minButton, ...(options?.classes ?? [])],
		});

		this.setting = setting;
	}

	toString(): string {
		return `[${MinButton.name}#${this.componentId}]`;
	}
}
