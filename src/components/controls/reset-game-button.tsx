import { useGameContext } from "../../hooks/useGameContex";
import { useMemory } from "../../hooks/useMemory";
import "./button.css";

export interface ResetGameButton {
  isEndGameScreen: boolean;
}

export const ResetGameButton = ({ isEndGameScreen }: ResetGameButton) => {
  const { components } = useGameContext();
  const memory = useMemory();

  const handleReset = () => {
    components.blockPanel.setProps({
      isVisible: true,
      children: "Resetting game...",
      timer: 5000,
      onShow() {
        memory.setContext(null);
        memory.setSettings(null);
      },
      routeTo: "/",
    });
  };

  return (
    <button className="button" type="button" onClick={handleReset}>
      {isEndGameScreen ? "Start a new game" : "Reset game & settings"}
    </button>
  );
};
