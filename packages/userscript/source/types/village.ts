import { BuildButton, GameTab, Job } from ".";

export type VillageTab = GameTab & {
  censusPanel: {
    census: {
      renderGovernment: (model: unknown) => void;
      update: () => void;
    };
  };
  festivalBtn: BuildButton;
};

export type JobInfo = { name: Job; unlocked: boolean; value: number };
