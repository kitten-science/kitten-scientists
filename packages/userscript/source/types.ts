export type TabId = "Religion" | "Village";
export type GameTab = {
  render: () => void;
  tabId: TabId;
};

export type GamePage = {
  console: {
    maxMessages: number;
  };
  msg: (...args: Array<string>) => { span: HTMLElement };
  tabs: Array<GameTab>;
  timer: {
    ticksTotal: number;
  };
  ui: {
    activeTabId: TabId;
  };
  village: {
    /**
     * @deprecated
     */
    map: {
      expeditionNode: {
        x: number;
        y: number;
      };
      explore: (x: number, y: number) => void;
      toLevel: (x: number, y: number) => number;
      getExplorationPrice: (x: number, y: number) => number;
      villageData: Record<string, unknown>;
    };
  };
};
