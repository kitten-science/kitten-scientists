import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { InvalidArgumentError } from "@oliversalzburg/js-utils/errors/InvalidArgumentError.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { de, enUS, he, type Locale, zhCN } from "date-fns/locale";
import { Engine, type EngineState, type SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { StateSettings } from "../settings/StateSettings.js";
import { Unique } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import { SavegameLoader } from "../tools/SavegameLoader.js";
import type { KGSaveData } from "../types/_save.js";
import { UserScriptLoader } from "../UserScriptLoader.js";
import { Button } from "./components/Button.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconButton } from "./components/IconButton.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { ListItem } from "./components/ListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextButton } from "./components/TextButton.js";
import { ToolbarListItem } from "./components/ToolbarListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export type StoredGame = {
  label: string;
  game: KGSaveData;
  timestamp: string;
};
export type StoredState = {
  label: string;
  state: EngineState;
  timestamp: string;
};

export class StateManagementUi extends SettingsPanel<StateSettings> {
  readonly games = new Array<Unique<StoredGame>>();

  /**
   * The states persisted to local storage. They use Unique<T> so that when we
   * provide a state to the engine to load or get a state from the engine to
   * save, we are not accidentally sharing a reference to a live object.
   */
  readonly states = new Array<Unique<StoredState>>();

  readonly gameList: SettingsList;
  readonly stateList: SettingsList;
  readonly locale: Locale;

  constructor(
    parent: UiComponent,
    settings: StateSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    console.debug(...cl(`Constructing ${StateManagementUi.name}`));

    const label = parent.host.engine.i18n("state.title");
    super(
      parent,
      settings,
      new LabelListItem(parent, label, {
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.State,
      }).addChildrenHead([
        new Container(parent, {
          classes: [stylesLabelListItem.fillSpace],
        }),
      ]),
      {
        onRefresh: () => {
          this._refreshGameList();
          this._refreshStateList();
        },
      },
    );

    this.gameList = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this.stateList = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });

    this.locale =
      locale.selected === "zh-CN"
        ? zhCN
        : locale.selected === "he-IL"
          ? he
          : locale.selected === "de-DE"
            ? de
            : enUS;

    this.addChildContent(
      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        new SettingListItem(this, this.setting.noConfirm, this.host.engine.i18n("state.noConfirm")),
        new ListItem(this).addChild(new Delimiter(this)),

        new HeaderListItem(this, this.host.engine.i18n("state.local")),
        new ToolbarListItem(this).addChildren([
          new Button(this, this.host.engine.i18n("state.import"), Icons.Import, {
            onClick: () => {
              this.import();
            },
            title: this.host.engine.i18n("state.importTitle"),
          }),
        ]),
        new ListItem(this).addChild(new Delimiter(this)),

        new HeaderListItem(this, this.host.engine.i18n("state.localStates")),
        new ToolbarListItem(this).addChildren([
          new Button(this, this.host.engine.i18n("state.store"), Icons.SaveAs, {
            onClick: () => {
              this.storeState();
            },
            title: this.host.engine.i18n("state.storeState"),
          }),
          new Button(this, this.host.engine.i18n("copy"), Icons.Copy, {
            onClick: () => {
              this.copyState().catch(redirectErrorsToConsole(console));
              this.host.engine.imessage("state.copied.stateCurrent");
            },
            title: this.host.engine.i18n("state.copy.stateCurrent"),
          }),
          new Button(this, this.host.engine.i18n("state.new"), Icons.Draft, {
            onClick: () => {
              this.storeStateFactoryDefaults();
              this.host.engine.imessage("state.stored.state");
            },
            title: this.host.engine.i18n("state.storeFactory"),
          }),
          new Button(this, this.host.engine.i18n("state.exportAll"), Icons.Sync, {
            onClick: () => {
              this.exportStateAll();
            },
            title: this.host.engine.i18n("state.exportAllTitle"),
          }),
        ]),
        new ListItem(this).addChild(this.stateList),
        new ListItem(this).addChild(new Delimiter(this)),

        new HeaderListItem(this, this.host.engine.i18n("state.localGames")),
        new ToolbarListItem(this).addChildren([
          new Button(this, this.host.engine.i18n("state.store"), Icons.SaveAs, {
            onClick: () => {
              this.storeGame();
              this.host.engine.imessage("state.stored.game");
            },
            title: this.host.engine.i18n("state.storeGame"),
          }),
          new Button(this, this.host.engine.i18n("copy"), Icons.Copy, {
            onClick: () => {
              this.copyGame().catch(redirectErrorsToConsole(console));
              this.host.engine.imessage("state.copied.gameCurrent");
            },
            title: this.host.engine.i18n("state.copy.gameCurrent"),
          }),
        ]),
        new ListItem(this).addChild(this.gameList),
        new SettingListItem(this, this.setting.compress, this.host.engine.i18n("state.compress")),
      ]),
    );

    this._loadGames();
    this._loadStates();
  }

  private _loadGames() {
    let index = 0;
    let game = localStorage.getItem(`ks.game.${index}`);
    this.games.splice(0);
    try {
      while (!isNil(game)) {
        const gameObject = JSON.parse(game) as StoredGame;
        this.games.push(new Unique(gameObject));
        game = localStorage.getItem(`ks.game.${++index}`);
      }
    } catch (error) {
      console.error(...cl(error));
    }
  }
  private _storeGames() {
    let index = 0;
    let game = localStorage.getItem(`ks.game.${index}`);
    while (!isNil(game)) {
      localStorage.removeItem(`ks.game.${index}`);
      game = localStorage.getItem(`ks.game.${++index}`);
    }

    index = 0;
    for (const game of this.games) {
      localStorage.setItem(`ks.game.${index++}`, JSON.stringify(game));
    }
  }

  private _loadStates() {
    let stateIndex = 0;
    let state = localStorage.getItem(`ks.state.${stateIndex}`);
    this.states.splice(0);
    try {
      while (!isNil(state)) {
        const stateObject = JSON.parse(state) as StoredState;
        KittenScientists.unknownAsEngineStateOrThrow(stateObject.state);
        this.states.push(new Unique(stateObject));
        state = localStorage.getItem(`ks.state.${++stateIndex}`);
      }
    } catch (error) {
      console.error(...cl(error));
    }
  }
  private _storeStates() {
    let stateIndex = 0;
    let state = localStorage.getItem(`ks.state.${stateIndex}`);
    while (!isNil(state)) {
      localStorage.removeItem(`ks.state.${stateIndex}`);
      state = localStorage.getItem(`ks.state.${++stateIndex}`);
    }

    stateIndex = 0;
    for (const state of this.states) {
      localStorage.setItem(`ks.state.${stateIndex++}`, JSON.stringify(state));
    }
  }

  private _refreshGameList() {
    this.gameList.removeChildren(this.gameList.children);
    this.gameList.addChildren(
      this.games
        .sort(
          (a, b) =>
            new Date(a.unwrap().timestamp).getTime() - new Date(b.unwrap().timestamp).getTime(),
        )
        .map(game => [game.unwrap(), game] as const)
        .map(([game, gameSlot]) =>
          new ButtonListItem(
            this,
            new TextButton(
              this,
              `${game.label} (${formatDistanceToNow(new Date(game.timestamp), {
                addSuffix: true,
                locale: this.locale,
              })})`,
              {
                onClick: () => {
                  this.loadGame(game.game).catch(redirectErrorsToConsole(console));
                  this.host.engine.imessage("state.loaded.game", [game.label]);
                },
                title: new Date(game.timestamp).toLocaleString(),
              },
            ),
          ).addChildren([
            new Container(this, { classes: [stylesLabelListItem.fillSpace] }),
            new IconButton(this, Icons.Save, this.host.engine.i18n("state.update.game"), {
              onClick: () => {
                this.updateGame(gameSlot, this.host.game.save());
                this.host.engine.imessage("state.updated.game", [game.label]);
              },
            }),
            new IconButton(this, Icons.Edit, this.host.engine.i18n("state.edit.game"), {
              onClick: () => {
                this.storeGame(game.game);
                this.deleteGame(gameSlot, true);
                this.host.engine.imessage("state.updated.game", [game.label]);
              },
            }),
            new IconButton(this, Icons.Copy, this.host.engine.i18n("state.copy.game"), {
              onClick: () => {
                this.copyGame(game.game).catch(redirectErrorsToConsole(console));
                this.host.engine.imessage("state.copied.game", [game.label]);
              },
            }),
            new IconButton(this, Icons.Delete, this.host.engine.i18n("state.delete.game"), {
              onClick: () => {
                this.deleteGame(gameSlot);
                this.host.engine.imessage("state.deleted.game", [game.label]);
              },
            }),
          ]),
        ),
    );
  }
  private _refreshStateList() {
    this.stateList.removeChildren(this.stateList.children);
    this.stateList.addChildren(
      this.states
        .sort(
          (a, b) =>
            new Date(a.unwrap().timestamp).getTime() - new Date(b.unwrap().timestamp).getTime(),
        )
        .map(stateSlot => [stateSlot.unwrap(), stateSlot] as const)
        .map(([state, stateSlot]) =>
          new ButtonListItem(
            this,
            new TextButton(
              this,
              `${state.label} (${formatDistanceToNow(new Date(state.timestamp), {
                addSuffix: true,
                locale: this.locale,
              })})`,
              {
                onClick: () => {
                  this.loadState(state.state);
                  this.host.engine.imessage("state.loaded.state", [state.label]);
                },
                title: new Date(state.timestamp).toLocaleString(),
              },
            ),
          ).addChildren([
            new Container(this, { classes: [stylesLabelListItem.fillSpace] }),
            new IconButton(this, Icons.Save, this.host.engine.i18n("state.update.state"), {
              onClick: () => {
                this.updateState(stateSlot, this.host.engine.stateSerialize());
                this.host.engine.imessage("state.updated.state", [state.label]);
              },
            }),
            new IconButton(this, Icons.Edit, this.host.engine.i18n("state.edit.state"), {
              onClick: () => {
                this.storeState(state.state);
                this.deleteState(stateSlot, true);
                this.host.engine.imessage("state.updated.state", [state.label]);
              },
            }),
            new IconButton(this, Icons.Copy, this.host.engine.i18n("state.copy.state"), {
              onClick: () => {
                this.copyState(state.state).catch(redirectErrorsToConsole(console));
                this.host.engine.imessage("state.copied.state", [state.label]);
              },
            }),
            new IconButton(this, Icons.Delete, this.host.engine.i18n("state.delete.state"), {
              onClick: () => {
                this.deleteState(stateSlot);
                this.host.engine.imessage("state.deleted.state", [state.label]);
              },
            }),
          ]),
        ),
    );
  }

  async copyState(state?: EngineState) {
    await this.host.copySettings(state, false);
  }

  async copyGame(game?: KGSaveData) {
    const saveData = game ?? this.host.game.save();
    const saveDataString = JSON.stringify(saveData);
    const encodedData = this.setting.compress.enabled
      ? this.host.game.compressLZData(saveDataString)
      : saveDataString;

    await UserScriptLoader.window.navigator.clipboard.writeText(encodedData);
  }

  /**
   * Request text input from the user, and try to import it.
   *
   * Things users might paste, in no specific order:
   * 1. Kittens Game Save, uncompressed line-agnostic JSON
   * 2. Kittens Game Save, lz-string compressed single-line UTF-8 string
   * 3. Kittens Game Save, lz-string compressed single-line UTF-16 string
   * 4. Kitten Scientists Settings, uncompressed line-agnostic JSON
   * 5. Kitten Scientists Settings, lz-string compressed single-line Base64 string
   * 6. Kitten Scientists Settings Export, multi-line string where all lines are either:
   *    - #4, but must be single-line
   *    - #5
   * 7. Kitten Scientists Settings Export, multi-line string where each line is
   *    an uncompressed JSON string serialization of:
   *    {
   *      label: "The label the user previously assigned to these settings.",
   *      state: "The same options as #6",
   *      timestamp: "Last time the settings were modified. As new Date().toISOString().",
   *    }
   */
  import() {
    const userInput = UserScriptLoader.window.prompt(this.host.engine.i18n("state.loadPrompt"));
    if (isNil(userInput)) {
      return;
    }

    const importId = new Date().toDateString();
    let importSequence = 1;
    const makeImportLabel = () =>
      this.host.engine.i18n("state.importedState", [`${importId} #${importSequence++}`]);

    const internalImport = (input: string) => {
      // Handles #4 and #5
      try {
        // decodeSettings throws if the input is not a valid engine state.
        const state = KittenScientists.decodeSettings(input);
        this.storeState(state, makeImportLabel());
        this.host.engine.imessage("state.imported.state");
        return;
      } catch (_error) {
        // Not a valid Kitten Scientists state.
      }

      // Handles #7
      try {
        const subjectData = JSON.parse(input) as {
          label: string;
          state: string;
          timestamp: string;
        };
        const state = KittenScientists.decodeSettings(subjectData.state);
        this.storeState(state, subjectData.label);
        this.host.engine.imessage("state.imported.state");
        return;
      } catch (_error) {
        // Not a valid Kitten Scientists state.
      }

      // Attempt to parse as KG save.
      let subjectData: KGSaveData;
      try {
        subjectData = JSON.parse(input) as KGSaveData;
      } catch (_error) {
        // Expected, as we assume compressed input.
        const uncompressed = this.host.game.decompressLZData(input);
        try {
          subjectData = JSON.parse(uncompressed) as KGSaveData;
        } catch (_error) {
          // Continued failure to parse as JSON might indicate newline-delimited JSON.
          if (input.match(/\r?\n/)) {
            return input.split(/\r?\n/).map(line => void internalImport(line));
          }

          throw new InvalidArgumentError(
            "The provided input can not be parsed as anything we understand.",
          );
        }
      }

      // If game contains KS settings, import those separately.
      let stateLabel: string | undefined;
      if (!isNil(subjectData) && "ks" in subjectData && !isNil(subjectData.ks)) {
        const state = subjectData.ks.state[0];
        stateLabel = this.storeState(state, makeImportLabel()) ?? undefined;
        this.host.engine.imessage("state.imported.state");
        subjectData.ks = undefined;
      }

      this.storeGame(subjectData, stateLabel);
      this.host.engine.imessage("state.imported.game");
    };

    internalImport(userInput);
  }

  storeGame(game?: KGSaveData, label?: string): string | null {
    let gameLabel = label;

    if (isNil(gameLabel)) {
      gameLabel =
        UserScriptLoader.window.prompt(this.host.engine.i18n("state.storeGame.prompt")) ??
        undefined;
    }

    if (isNil(gameLabel)) {
      return null;
    }

    // Normalize empty string to "no label".
    gameLabel =
      (gameLabel === "" ? undefined : gameLabel) ?? this.host.engine.i18n("state.unlabeledGame");

    // Ensure labels aren't excessively long.
    gameLabel = gameLabel.substring(0, 127);

    this.games.push(
      new Unique({
        game: game ?? this.host.game.save(),
        label: gameLabel,
        timestamp: new Date().toISOString(),
      }),
    );

    this._storeGames();
    this.requestRefresh();

    return gameLabel;
  }

  storeState(state?: EngineState, label?: string): string | null {
    let stateLabel = label;

    if (isNil(stateLabel)) {
      stateLabel =
        UserScriptLoader.window.prompt(this.host.engine.i18n("state.storeState.prompt")) ??
        undefined;
    }

    if (isNil(stateLabel)) {
      return null;
    }

    // Normalize empty string to "no label".
    stateLabel =
      (stateLabel === "" ? undefined : stateLabel) ?? this.host.engine.i18n("state.unlabeledState");

    // Ensure labels aren't excessively long.
    stateLabel = stateLabel.substring(0, 127);

    this.states.push(
      new Unique({
        label: stateLabel,
        state: state ?? this.host.engine.stateSerialize(),
        timestamp: new Date().toISOString(),
      }),
    );

    this._storeStates();
    this.requestRefresh();

    return stateLabel;
  }

  storeStateFactoryDefaults() {
    this.storeState(Engine.DEFAULT_STATE);
  }

  storeAutoSave(state: EngineState) {
    const existing = this.states.find(state => state.unwrap().label === "Auto-Save");
    if (!isNil(existing)) {
      console.info(...cl("Updating existing Auto-Save..."));
      existing.replace({
        ...existing.unwrap(),
        state,
        timestamp: new Date().toISOString(),
      });

      this._storeStates();
      this.requestRefresh();

      return;
    }

    console.info(...cl("Storing new Auto-Save..."));
    this.storeState(state, "Auto-Save");
  }

  exportStateAll() {
    const statesJson = this.states
      .map(state => state.unwrap())
      .map(state =>
        JSON.stringify({
          label: state.label,
          state: KittenScientists.encodeSettings(state.state, false),
          timestamp: state.timestamp,
        }),
      )
      .join("\n");
    const a = document.createElement("a");
    const blob = new Blob([statesJson], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    a.setAttribute("href", url);
    a.setAttribute("download", `ks-local-states-${Date.now()}.ndjson`);
    a.click();
  }

  async loadGame(game: KGSaveData) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    await new SavegameLoader(this.host.game).loadRaw(game);
  }

  loadState(state: EngineState) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    this.host.engine.stateLoad(state, true);
    this.host.refreshEntireUserInterface();
  }

  loadAutoSave() {
    if (this.host.engine.isLoaded) {
      console.info(...cl("Not attempting to load Auto-Save, because a state is already loaded."));
      return;
    }

    const existing = this.states.find(state => state.unwrap().label === "Auto-Save");
    if (isNil(existing)) {
      console.info(...cl("No Auto-Save settings found."));
      return;
    }

    console.info(...cl("Loading Auto-Save..."));
    this.host.engine.stateLoad(existing.unwrap().state, false);
  }

  updateGame(game: Unique<StoredGame>, newGame: KGSaveData) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    const label = game.unwrap().label;
    game.replace({
      game: newGame,
      label,
      timestamp: new Date().toISOString(),
    });
    this._storeGames();
    this.requestRefresh();
  }

  updateState(state: Unique<StoredState>, newState: EngineState) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    const label = state.unwrap().label;
    state.replace({
      label,
      state: newState,
      timestamp: new Date().toISOString(),
    });
    this._storeStates();
    this.requestRefresh();
  }

  deleteGame(game: Unique<StoredGame>, force = false) {
    if (!force && this._destructiveActionPrevented()) {
      return;
    }

    const index = this.games.indexOf(game);
    if (index < 0) {
      return;
    }

    this.games.splice(index, 1);
    this._storeGames();
    this.requestRefresh();
  }

  deleteState(state: Unique<StoredState>, force = false) {
    if (!force && this._destructiveActionPrevented()) {
      return;
    }

    const index = this.states.indexOf(state);
    if (index < 0) {
      return;
    }

    this.states.splice(index, 1);
    this._storeStates();
    this.requestRefresh();
  }

  private _destructiveActionPrevented(): boolean {
    if (
      !this.setting.noConfirm.enabled &&
      !UserScriptLoader.window.confirm(this.host.engine.i18n("state.confirmDestruction"))
    ) {
      return true;
    }

    return false;
  }
}
