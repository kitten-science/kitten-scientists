export const LOCAL_STORAGE_PATH = "/local_storage";

// KGNet Savegame Storage

export interface KGSaveData {
  saveVersion: number;
  resources: unknown;
  telemetry: {
    guid: string;
  };
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
