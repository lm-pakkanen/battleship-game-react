import { useCallback } from "react";
import { GameSettings } from "../constructors/GameSettings";

export const useMemory = () => {
  const getSettings = useCallback((): undefined | GameSettings["settings"] => {
    const settings = localStorage.getItem("battleship-settings");

    if (settings) {
      return JSON.parse(settings);
    }
  }, []);

  const setSettings = useCallback(
    (settings: null | GameSettings["settings"]) => {
      localStorage.setItem(
        "battleship-settings",
        settings ? JSON.stringify(settings) : ""
      );
    },
    []
  );

  return {
    setSettings,
    getSettings,
  };
};
