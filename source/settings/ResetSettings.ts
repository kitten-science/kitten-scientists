import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetBonfireSettings } from "./ResetBonfireSettings.js";
import { ResetReligionSettings } from "./ResetReligionSettings.js";
import { ResetResourcesSettings } from "./ResetResourcesSettings.js";
import { ResetSpaceSettings } from "./ResetSpaceSettings.js";
import { ResetTimeSettings } from "./ResetTimeSettings.js";
import { ResetUpgradeSettings } from "./ResetUpgradeSettings.js";
import { Setting, SettingTriggerMax } from "./Settings.js";

export class ResetSettings extends Setting {
	bonfire: ResetBonfireSettings;
	religion: ResetReligionSettings;
	resources: ResetResourcesSettings;
	space: ResetSpaceSettings;
	time: ResetTimeSettings;
	upgrades: ResetUpgradeSettings;

	/**
	 * Before resetting, stop all other automations and wait until every
	 * capped resource is filled to `trigger` (fraction of its storage).
	 * This maximizes what Chronospheres carry over into the next run.
	 * `max` is the longest we're willing to wait, in minutes (-1 = forever).
	 * Resources that can't reach the target within the remaining time are skipped.
	 */
	stockpile: SettingTriggerMax;

	constructor(
		enabled = true,
		bonfire = new ResetBonfireSettings(),
		religion = new ResetReligionSettings(),
		resources = new ResetResourcesSettings(),
		space = new ResetSpaceSettings(),
		time = new ResetTimeSettings(),
		upgrades = new ResetUpgradeSettings(),
		stockpile = new SettingTriggerMax(true, 0.99, 10),
	) {
		super(enabled);
		this.bonfire = bonfire;
		this.religion = religion;
		this.resources = resources;
		this.space = space;
		this.time = time;
		this.upgrades = upgrades;
		this.stockpile = stockpile;
	}

	load(settings: Maybe<Partial<ResetSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);

		this.bonfire.load(settings.bonfire);
		this.religion.load(settings.religion);
		this.resources.load(settings.resources);
		this.space.load(settings.space);
		this.time.load(settings.time);
		this.upgrades.load(settings.upgrades);
		this.stockpile.load(settings.stockpile);
	}
}
