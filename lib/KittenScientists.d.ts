import type { ReleaseChannel } from "@kitten-science/action-release-info";
import { Engine, type EngineState, type GameLanguage, type SupportedLocale } from "./Engine.js";
import type { Game, I18nEngine } from "./types/index.js";
declare global {
  const KS_RELEASE_CHANNEL: ReleaseChannel;
  const KS_VERSION: string | undefined;
}
export declare const ksVersion: (prefix?: string) => string;
export declare class KittenScientists {
  readonly game: Game;
  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;
  private _userInterface;
  engine: Engine;
  private _gameBeforeSaveHandle;
  private _serverLoadHandle;
  constructor(
    game: Game,
    i18nEngine: I18nEngine,
    gameLanguage?: GameLanguage,
    engineState?: EngineState,
  );
  private _constructUi;
  rebuildUi(): void;
  /**
   * Runs some validations against the game to determine if internal control
   * structures still match up with expectations.
   * Issues should be logged to the console.
   */
  validateGame(): void;
  /**
   * Removes Kitten Scientists from the browser.
   */
  unload(): void;
  /**
   * Start the user script after loading and configuring it.
   */
  run(): void;
  /**
   * Check which versions of KS are currently published.
   */
  runUpdateCheck(): Promise<void>;
  /**
   * Requests the user interface to refresh.
   */
  refreshUi(): void;
  /**
   * Turns a string like 52.7 into the number 52.7
   * @param value - String representation of an absolute value.
   * @returns A number between 0 and Infinity, where Infinity is represented as -1.
   */
  parseFloat(value: string | null): number | null;
  parseAbsolute(value: string | null): number | null;
  /**
   * Turns a string like 52.7 into the number 0.527
   * @param value - String representation of a percentage.
   * @returns A number between 0 and 1 representing the described percentage.
   */
  parsePercentage(value: string): number;
  /**
   * Turns a number into a game-native string representation.
   * Infinity, either by actual value or by -1 representation, is rendered as a symbol.
   * @param value - The number to render as a string.
   * @param host - The host instance which we can use to let the game render values for us.
   * @returns A string representing the given number.
   */
  renderAbsolute(value: number, locale?: SupportedLocale | "invariant"): string;
  /**
   * Turns a number like 0.527 into a string like 52.7
   * @param value - The number to render as a string.
   * @param locale - The locale in which to render the percentage.
   * @param withUnit - Should the percentage sign be included in the output?
   * @returns A string representing the given percentage.
   */
  renderPercentage(
    value: number,
    locale?: SupportedLocale | "invariant",
    withUnit?: boolean,
  ): string;
  renderFloat(value: number, locale?: SupportedLocale | "invariant"): string;
  /**
   * Encodes an engine states into a string.
   *
   * @param settings The engine state to encode.
   * @param compress Should we use LZString compression?
   * @returns The settings encoded into a string.
   */
  static encodeSettings(settings: EngineState, compress?: boolean): string;
  /**
   * Given a serialized engine state, attempts to deserialize that engine state.
   * Assumes the input has been compressed with LZString, will accept uncompressed.
   *
   * @param compressedSettings An engine state that has previously been serialized to a string.
   * @returns The engine state, if valid.
   */
  static decodeSettings(compressedSettings: string): EngineState;
  /**
   * Retrieves the state from the engine.
   *
   * @returns The engine state.
   */
  getSettings(): EngineState;
  getSettingsAsJson(): string;
  /**
   * Updates the engine with a new state.
   *
   * @param settings The engine state to apply.
   */
  setSettings(settings: EngineState): void;
  /**
   * Loads an encoded state into the engine.
   *
   * @param encodedSettings The encoded settings.
   */
  importSettingsFromString(encodedSettings: string): void;
  /**
   * Copies an engine state to the clipboard.
   *
   * @param settings The engine state to copy to the clipboard.
   * The default is this engine's current state.
   * @param compress Should the state be compressed?
   */
  copySettings(settings?: EngineState, compress?: boolean): Promise<void>;
  /**
   * Determines if an object is an engine state, and throws an
   * exception otherwise.
   *
   * @param subject The object that is hopefully an engine state.
   * @param subject.v The version in the engine state.
   * @returns An engine state.
   */
  static unknownAsEngineStateOrThrow(subject?: unknown): EngineState;
  installSaveManager(): void;
  private _saveManager;
}
//# sourceMappingURL=KittenScientists.d.ts.map
