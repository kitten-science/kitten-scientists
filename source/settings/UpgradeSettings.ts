import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import type { GamePage } from "../types/game.js";
import {
	type UnsafeUpgrade,
	type UnsafeZebraUpgrade,
	type Upgrade,
	Upgrades,
	type ZebraUpgrade,
	ZebraUpgrades,
} from "../types/index.js";
import { SettingTrigger } from "./Settings.js";

export class UpgradeSettingsItem<
	TUpgrade = Upgrade,
	TUpgradeImpl = UnsafeUpgrade,
> extends SettingTrigger {
	readonly #upgrade: TUpgrade;
	#$upgrade: TUpgradeImpl | undefined;

	get upgrade() {
		return this.#upgrade;
	}
	get $upgrade() {
		return this.#$upgrade;
	}
	set $upgrade(value: TUpgradeImpl | undefined) {
		this.#$upgrade = value;
	}

	constructor(upgrade: TUpgrade, enabled = false) {
		super(enabled, -1);
		this.#upgrade = upgrade;
	}
}

export type UpgradeSettingsItems = Record<
	Upgrade,
	UpgradeSettingsItem<Upgrade, UnsafeUpgrade>
>;

export class UpgradeSettings extends SettingTrigger {
	readonly upgrades: UpgradeSettingsItems;

	constructor(enabled = false) {
		super(enabled, -1);
		this.upgrades = this.initUpgrades();
	}

	private initUpgrades(): UpgradeSettingsItems {
		const items = {} as UpgradeSettingsItems;
		for (const item of Upgrades) {
			items[item] = new UpgradeSettingsItem(item);
		}
		return items;
	}

	static validateGame(game: GamePage, settings: UpgradeSettings) {
		const inSettings = Object.keys(settings.upgrades);
		const inGame = game.workshop.upgrades.map((upgrade) => upgrade.name);

		const missingInSettings = difference(inGame, inSettings);
		const redundantInSettings = difference(inSettings, inGame);

		for (const _ of missingInSettings) {
			console.warn(
				...cl(
					`The workshop upgrade '${_}' is not tracked in Kitten Scientists!`,
				),
			);
		}
		for (const _ of redundantInSettings) {
			console.warn(
				...cl(`The workshop upgrade '${_}' is not an upgrade in Kittens Game!`),
			);
		}
	}

	load(settings: Maybe<Partial<UpgradeSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);

		consumeEntriesPedantic(
			this.upgrades,
			settings.upgrades,
			(upgrade, item) => {
				upgrade.enabled = item?.enabled ?? upgrade.enabled;
				upgrade.trigger = item?.trigger ?? upgrade.trigger;
			},
		);
	}
}

export type ZebraUpgradeSettingsItems = Record<
	ZebraUpgrade,
	UpgradeSettingsItem<ZebraUpgrade, UnsafeZebraUpgrade>
>;

export class ZebraUpgradeSettings extends SettingTrigger {
	readonly upgrades: ZebraUpgradeSettingsItems;

	constructor(enabled = false) {
		super(enabled, -1);
		this.upgrades = this.initUpgrades();
	}

	private initUpgrades(): ZebraUpgradeSettingsItems {
		const items = {} as ZebraUpgradeSettingsItems;
		for (const item of ZebraUpgrades) {
			items[item] = new UpgradeSettingsItem<ZebraUpgrade, UnsafeZebraUpgrade>(
				item,
			);
		}
		return items;
	}

	static validateGame(game: GamePage, settings: ZebraUpgradeSettings) {
		const inSettings = Object.keys(settings.upgrades);
		const inGame = game.workshop.zebraUpgrades.map((upgrade) => upgrade.name);

		const missingInSettings = difference(inGame, inSettings);
		const redundantInSettings = difference(inSettings, inGame);

		for (const _ of missingInSettings) {
			console.warn(
				...cl(
					`The Zebra workshop upgrade '${_}' is not tracked in Kitten Scientists!`,
				),
			);
		}
		for (const _ of redundantInSettings) {
			console.warn(
				...cl(`The Zebra workshop upgrade '${_}' is not an upgrade in Kittens Game!`),
			);
		}
	}

	load(settings: Maybe<Partial<ZebraUpgradeSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);

		consumeEntriesPedantic(
			this.upgrades,
			settings.upgrades,
			(upgrade, item) => {
				upgrade.enabled = item?.enabled ?? upgrade.enabled;
				upgrade.trigger = item?.trigger ?? upgrade.trigger;
			},
		);
	}
}
