import { BuildButton, GameTab, Job } from "./index.js";

export type VillageTab = GameTab & {
  censusPanel?: {
    census: {
      renderGovernment: (model: unknown) => void;
      update: () => void;
    };
  };
  festivalBtn: BuildButton;
};

export type JobInfo = { name: Job; title: string; unlocked: boolean; value: number };
