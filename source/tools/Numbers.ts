/**
 * Parsing of numeric user input.
 *
 * The game happily works with values far beyond what a 32-bit integer can hold,
 * and it keeps scaling them up. This module exists so that every place which
 * turns user input into a number accepts the exact same syntax, and so that it
 * never silently turns a value into something else:
 *
 * - `52` – a plain number
 * - `52.7` – a number with decimals
 * - `1e42` – scientific notation, including a negative or explicit exponent
 * - `1.5K`, `2M`, `3G`, `4T`, `5P` – the postfixes the game uses for display
 * - `∞` – the game's symbol for "no limit"
 *
 * Supported by the two percentage-aware fields (see `parsePercentageInput`):
 *
 * - `52%` – a share of a maximum, parsed as the number `0.52`
 */

export interface ParsedAbsolute {
	readonly kind: "absolute";
	readonly value: number;
}

export interface ParsedPercentage {
	readonly kind: "percentage";
	readonly value: number;
}

/**
 * Input that can't be read as a number.
 *
 * This is reported as a value of its own, instead of as a `null` result, so
 * that callers which have to return a number regardless (like
 * `parsePercentage`) can keep the current value instead of storing `NaN`.
 */
export interface ParsedInvalid {
	readonly kind: "invalid";
}

export type ParsedEntry = ParsedAbsolute | ParsedPercentage | ParsedInvalid;

/** The result of parsing input that might be a number, or might be nothing. */
export type ParseEntryResult = ParsedEntry | null;

/**
 * Matches the syntax accepted by `parseAbsoluteEntry`.
 *
 * The first group holds the value itself, as a mantissa with an optional
 * exponent, followed by an optional postfix.
 */
export const NUMBER_PATTERN = /^(\d+(?:\.\d+)?(?:e[+-]?\d+)?)([KMGTP]?)$/i;

/** The multiplier for every postfix the game uses for display. */
const POSTFIX_FACTORS: Record<string, number> = {
	"": 1,
	K: 1000 ** 1,
	M: 1000 ** 2,
	G: 1000 ** 3,
	T: 1000 ** 4,
	P: 1000 ** 5,
};

/**
 * Combine a mantissa and its postfix multiplier into a number.
 *
 * The multiplication is done up front by combining the mantissa with the
 * multiplier before it is parsed. `Number("1e308") * 1000` would overflow into
 * `Infinity`, while `Number("1e308" + "e3")` still reports the highest value
 * the engine can represent. The exponent is therefore transferred to the
 * numeric literal instead of the parsed value.
 *
 * @param mantissa - The value without its postfix, e.g. `1.5e10`.
 * @param factor - The multiplier of the postfix, e.g. `1000` for `K`.
 * @returns The parsed value, or `null` if it isn't representable in a number.
 */
function applyFactor(mantissa: string, factor: number): number | null {
	if (factor === 1) {
		const value = Number(mantissa);
		return Number.isFinite(value) ? value : null;
	}

	const exponent = Math.log10(factor);
	return applyFactor(`${mantissa}e${exponent}`, 1);
}

/**
 * Parses user input into an absolute value.
 *
 * This never returns an infinity. A value that isn't representable as a number
 * is reported as `null`, so that callers can treat it the same way as input
 * they couldn't parse at all, instead of silently storing `Infinity`.
 *
 * @param value - User input, e.g. `52`, `1e42` or `4.2T`.
 * @returns The parsed value, or `null` if the input isn't a valid number.
 */
export function parseAbsoluteEntry(value: string): ParsedAbsolute | null {
	if (value === "" || value === "∞") {
		return null;
	}

	const match = NUMBER_PATTERN.exec(value.trim());
	if (match === null) {
		return null;
	}

	const number = applyFactor(match[1], POSTFIX_FACTORS[match[2].toUpperCase()]);
	if (number === null || number < 0) {
		return null;
	}

	return { kind: "absolute", value: number };
}

/**
 * Parses user input into either an absolute value or a share of a maximum.
 *
 * The mode is selected by the input itself: a trailing `%` turns the value into
 * a share (so `50%` becomes `0.5`), anything else is an absolute value.
 *
 * @param value - User input, e.g. `50%`, `52` or `1e42`.
 * @returns The parsed entry, or `null` if the input was empty.
 */
export function parsePercentageEntry(value: string): ParseEntryResult {
	if (value.trim() === "") {
		return null;
	}

	const trimmedValue = value.trim();
	const match = trimmedValue.endsWith("%")
		? /^(.*)%$/.exec(trimmedValue)
		: null;
	if (match === null) {
		const absoluteValue = parseAbsoluteEntry(value);
		return absoluteValue ?? { kind: "invalid" };
	}

	const percentage = parseAbsoluteEntry(match[1]);
	if (percentage === null) {
		return { kind: "invalid" };
	}

	// A share of a maximum can't be negative or exceed the maximum. Clamping is
	// what the engine has always done for percentages; it keeps the stored value
	// range intact.
	return {
		kind: "percentage",
		value: Math.max(0, Math.min(1, percentage.value / 100)),
	};
}
