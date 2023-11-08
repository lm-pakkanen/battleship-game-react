import { useContext } from "react";
import { GameContext } from "../context/game-context";

export const useGameContext = () => useContext(GameContext);
