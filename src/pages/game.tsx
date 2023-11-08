import { GameContent } from "../components/game/content";
import { GameContextProvider } from "../context/game-context";
import "./game.css";

export const Game = () => {
  return (
    <GameContextProvider>
      <GameContent />
    </GameContextProvider>
  );
};
