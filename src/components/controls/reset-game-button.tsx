import { initialGameContext } from "../../context/game-context";
import { useGameContext } from "../../hooks/useGameContex";
import { useMemory } from "../../hooks/useMemory";

export const ResetGameButton = () => {
  const { functions } = useGameContext();
  const memory = useMemory();

  const handleReset = () => {
    memory.setContext(null);
    memory.setSettings(null);

    functions.setStage(initialGameContext.stage);
    functions.setTurn(initialGameContext.turn);
    functions.setPlayer1(initialGameContext.player1);
    functions.setPlayer2(initialGameContext.player2);
    functions.setSettings(initialGameContext.settings);

    window.location.href = "/";
  };

  return (
    <button className="reset-game-button" type="button" onClick={handleReset}>
      Reset game & settings
    </button>
  );
};
