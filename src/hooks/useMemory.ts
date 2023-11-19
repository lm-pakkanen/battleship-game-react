import { useCallback } from "react";
import { GameSettings } from "../constructors/GameSettings";
import { GameContext, initialGameContext } from "../context/game-context";

type SavedContext = {
  loadedFromMemory: boolean;
} & Pick<GameContext, "stage" | "turn" | "settings" | "player1" | "player2">;

const CONTEXT_KEY = "battleship-context";
const SETTINGS_KEY = "battleship-settings";

export const useMemory = () => {
  const getContext = useCallback((): SavedContext => {
    const contextString = localStorage.getItem(CONTEXT_KEY);
    const settings = getSettings();

    if (!contextString || !settings) {
      return { ...initialGameContext, loadedFromMemory: false };
    }

    const context = JSON.parse(contextString);
    return { ...context, settings, loadedFromMemory: true };
  }, []);

  const setContext = useCallback(
    (context: null | Omit<SavedContext, "settings" | "loadedFromMemory">) => {
      localStorage.setItem(CONTEXT_KEY, context ? JSON.stringify(context) : "");
    },
    []
  );

  const getSettings = useCallback((): undefined | GameSettings["settings"] => {
    const settings = localStorage.getItem(SETTINGS_KEY);

    if (settings) {
      return JSON.parse(settings);
    }
  }, []);

  const setSettings = useCallback(
    (settings: null | GameSettings["settings"]) => {
      localStorage.setItem(
        SETTINGS_KEY,
        settings ? JSON.stringify(settings) : ""
      );
    },
    []
  );

  return {
    getContext,
    setContext,
    getSettings,
    setSettings,
  };
};
