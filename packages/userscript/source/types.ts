export type GameTab = {
  render: () => void;
  tabId: string;
};

export type GamePage = {
  console: {
    maxMessages: number;
  };
  msg: (...args: Array<string>) => { span: HTMLElement };
  tabs: Array<GameTab>;
  ui: {
    activeTabId: string;
  };
};
