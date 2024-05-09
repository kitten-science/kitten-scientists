import { BuildButton, GameTab, Job, Kitten } from "./index.js";

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

export type JobInfo = { name: Job; title: string; unlocked: boolean; value: number };
