export const LOCAL_STORAGE_PATH = "/local_storage";

// KGNet Savegame Storage

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
