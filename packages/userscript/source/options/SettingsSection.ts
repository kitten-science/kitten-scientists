import { Setting, SettingTrigger } from "./Settings";

/**
 * One of the main settings sections.
 * Usually, these are associated with a specific tab in the game.
 */
export abstract class SettingsSection extends Setting {}
export abstract class SettingsSectionTrigger extends SettingTrigger {}
