import { useMemo } from "react";
import { useGameContext } from "../../hooks/useGameContex";
import { useMemory } from "../../hooks/useMemory";
import "./button.css";
import "./reset-game-button.css";

export interface ResetGameButton {
  isEndGameScreen: boolean;
}

export const ResetGameButton = ({ isEndGameScreen }: ResetGameButton) => {
  const { components } = useGameContext();
  const memory = useMemory();

  const classNames = useMemo(() => {
    const nextClassNames: string[] = ["button", "reset-game-button"];

    if (isEndGameScreen) {
      nextClassNames.push("game-over-reset-button");
    }

    return nextClassNames;
  }, [isEndGameScreen]);

  const handleReset = () => {
    components.blockPanel.setProps({
      id: "reset-game-block-panel",
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
    <button
      className={classNames.join(" ")}
      type="button"
      onClick={handleReset}
    >
      {isEndGameScreen ? "Start a new game" : "Reset game & settings"}
    </button>
  );
};
