import { initialGameContext } from "../../context/game-context";
import { useGameContext } from "../../hooks/useGameContex";
import { useMemory } from "../../hooks/useMemory";
import "./button.css";

export const ResetGameButton = () => {
  const { functions, components } = useGameContext();
  const memory = useMemory();

  const handleReset = () => {
    components.blockPanel.setProps({
      children: "Resetting game...",
      timer: 5000,
      onTimerEnd: () => {
        functions.setStage(initialGameContext.stage);
        functions.setTurn(initialGameContext.turn);
        functions.setPlayer1(initialGameContext.player1);
        functions.setPlayer2(initialGameContext.player2);
        functions.setSettings(initialGameContext.settings);
        window.location.href = "/";
      },
    });

    components.blockPanel.setIsVisible(true);

    setTimeout(() => {
      memory.setContext(null);
      memory.setSettings(null);
    }, 500);
  };

  return (
    <button className="button" type="button" onClick={handleReset}>
      Reset game & settings
    </button>
  );
};
