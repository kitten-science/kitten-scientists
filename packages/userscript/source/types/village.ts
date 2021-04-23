import { BuildButton, GameTab } from ".";

export type VillageTab = GameTab & {
  censusPanel: {
    census: {
      renderGovernment: (model: unknown) => void;
      update: () => void;
    };
  };
  festivalBtn: BuildButton;
};
