import { BuildButton, GameTab } from ".";

export type SpaceTab = GameTab & {
  GCPanel: BuildButton;
  planetPanels: Array<BuildButton>;
};
