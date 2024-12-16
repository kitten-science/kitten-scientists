import { BuildButton, GameTab, Job, Kitten } from "./index.js";

export type VillageTab = GameTab & {
  censusPanel?: {
    census: {
      renderGovernment: (model: unknown) => void;
      update: () => void;
    };
  };
  festivalBtn: BuildButton;
  makeLeader: (kitten: Kitten) => void;
  removeLeader: () => void;
};

export type JobInfo = { name: Job; title: string; unlocked: boolean; value: number };
