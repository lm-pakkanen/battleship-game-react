import { addAlert } from "../../functions/add-alert";
import { useGameContext } from "../../hooks/useGameContex";

export const ResetPlacementsButton = () => {
  const { turn, stage, functions } = useGameContext();

  const handleReset = () => {
    if (!turn || stage !== "placingShips") {
      addAlert("Not allowed!");
    }

    const setPlayerFn =
      turn === "player1" ? functions.setPlayer1 : functions.setPlayer2;

    setPlayerFn((oldState) => ({ ...oldState, shipLocations: [] }));
  };

  return (
    <button
      className="reset-ship-placements-button"
      type="button"
      onClick={handleReset}
    >
      Reset ships
    </button>
  );
};
