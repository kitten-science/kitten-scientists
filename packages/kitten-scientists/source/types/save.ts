// KGNet Savegame Storage

import type { EngineState } from "../Engine";

export interface KGSaveData {
  ach: unknown;
  achievements: Array<unknown>;
  bldData: unknown;
  buildings: Array<unknown>;
  calendar: {
    year: number;
    day: number;
    season: number;
    weather: null;
    festivalDays: number;
    cycle: number;
    cycleYear: number;
    futureSeasonTemporalParadox: number;
    cryptoPrice: number;
  };
  cathPollution: number;
  challenges: unknown;
  console: unknown;
  diplomacy: unknown;
  game: {
    forceShowLimits: unknown;
    isCMBREnabled: unknown;
    useWorkers: unknown;
    colorScheme: unknown;
    unlockedSchemes: unknown;
    karmaKittens: unknown;
    karmaZebras: unknown;
    ironWill: unknown;
    deadKittens: unknown;
    cheatMode: unknown;
    opts: unknown;
    lastBackup: unknown;
  };
  ks?: {
    state: Array<EngineState>;
  };
  prestige: unknown;
  religion: unknown;
  resources: Array<unknown>;
  saveVersion: number;
  science: unknown;
  server: { motdContent: string };
  space: unknown;
  stats: Array<unknown>;
  statsCurrent: Array<unknown>;
  telemetry: {
    guid: string;
  };
  time: unknown;
  village: unknown;
  void: unknown;
  workshop: unknown;
}
export interface KGNetSaveFromGame {
  guid: string;
  metadata: {
    calendar: {
      day: number;
      year: number;
    };
  };
  /**
   * lz-string compressed UTF-16.
   */
  saveData: string;
}
export interface KGNetSaveUpdate {
  guid: string;
  metadata?: {
    archived: string;
    label: string;
  };
}
export interface KGNetSaveFromAnalysts {
  telemetry: {
    guid: string;
  };
  calendar: {
    day: number;
    year: number;
  };
}
export interface KGNetSavePersisted {
  archived: boolean;
  guid: string;
  index: {
    calendar: {
      day: number;
      year: number;
    };
  };
  label: string;
  timestamp: number;
  /**
   * lz-string compressed UTF-16.
   */
  saveData: string;
  size: number;
}
