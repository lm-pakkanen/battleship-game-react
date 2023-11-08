import { initialGameContext } from "../../context/game-context";
import { useGameContext } from "../../hooks/useGameContex";
import { useMemory } from "../../hooks/useMemory";

export const ResetGameButton = () => {
  const { functions } = useGameContext();
  const memory = useMemory();

  const handleReset = () => {
    functions.setSettings(initialGameContext.settings);
    memory.setSettings(null);

    window.location.href = "/";
  };

  return (
    <button className="reset-game-button" type="button" onClick={handleReset}>
      Reset game & settings
    </button>
  );
};
