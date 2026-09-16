import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";

/**
 * Trigger values that can be given either as an absolute value or as a share of
 * a maximum.
 *
 * The user picks the mode by the input itself: a trailing `%` makes it a share
 * (see `parsePercentageEntry`). The mode is remembered with the setting, so the
 * value keeps being interpreted and displayed the way it was entered.
 */

/**
 * Resolve a configured trigger value into an absolute value.
 *
 * @param trigger - The configured trigger, either an absolute value or a share.
 * @param isPercentage - Is the trigger a share of `maximum`?
 * @param maximum - The maximum the share refers to, e.g. the storage capacity
 * of the resource the trigger belongs to.
 * @returns The absolute trigger value.
 */
export function resolveLimit(
	trigger: number,
	isPercentage: boolean,
	maximum: number,
): number {
	if (!isPercentage) {
		return trigger;
	}

	// A share of an unknown maximum can't be resolved. Report it as "no limit",
	// which is what a trigger of 0 or less means everywhere.
	if (!Number.isFinite(maximum) || maximum <= 0) {
		return 0;
	}

	return trigger * maximum;
}

/**
 * Render a trigger value the way it was entered.
 *
 * @param host - The userscript instance.
 * @param trigger - The configured trigger, either an absolute value or a share.
 * @param isPercentage - Is the trigger a share of the associated maximum?
 * @param locale - The locale to render the value for.
 */
export function renderTrigger(
	host: KittenScientists,
	trigger: number,
	isPercentage: boolean,
	locale: SupportedLocale | "invariant",
): string {
	return isPercentage
		? host.renderPercentage(trigger, locale, true)
		: host.renderAbsolute(trigger, locale);
}
