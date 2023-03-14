import { BuildButton, GameTab, Job, Kitten } from ".";

export type VillageTab = GameTab & {
  censusPanel: {
    census: {
      makeLeader: (kitten: Kitten) => void;
      renderGovernment: (model: unknown) => void;
      update: () => void;
    };
  };
  festivalBtn: BuildButton;
};

export type JobInfo = { name: Job; unlocked: boolean; value: number };
