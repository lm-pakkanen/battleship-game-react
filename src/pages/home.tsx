import { useState } from "react";
import {
  BOARD_SIZE_MAX,
  BOARD_SIZE_MIN,
  GameSettings,
  SHIP_COUNTS_MAX,
} from "../constructors/GameSettings";
import { useMemory } from "../hooks/useMemory";
import "./home.css";

export const Home = () => {
  const { setSettings } = useMemory();

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [boardSize, setBoardSize] = useState(
    Math.floor((BOARD_SIZE_MIN + BOARD_SIZE_MAX) / 2)
  );

  const [shipCounts, setShipCounts] = useState<
    Partial<GameSettings["settings"]["shipCounts"]>
  >({});

  const [player1NameError, setPlayer1NameError] = useState("");
  const [player2NameError, setPlayer2NameError] = useState("");

  const [boardSizeError, setBoardSizeError] = useState("");
  const [shipsCountError, setShipsCountError] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof GameSettings["settings"]
  ) => {
    const eventValue = event.currentTarget.value;

    switch (fieldName) {
      case "player1Name": {
        setPlayer1NameError("");
        setPlayer1Name(eventValue);
        break;
      }

      case "player2Name": {
        setPlayer2NameError("");
        setPlayer2Name(eventValue);
        break;
      }

      case "boardSize": {
        setBoardSizeError("");

        const asInt = parseInt(eventValue);

        if (Number.isNaN(asInt)) {
          setBoardSizeError("Invalid input.");
          break;
        }

        if (GameSettings.isBoardSizeValid(asInt)) {
          setBoardSize(asInt);
        } else {
          setBoardSizeError(
            `Board size must be between ${BOARD_SIZE_MIN} and ${BOARD_SIZE_MAX}.`
          );
        }

        break;
      }
    }
  };

  const handleShipCountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    shipKey: keyof GameSettings["settings"]["shipCounts"],
    shipDisplayName: string
  ) => {
    setShipsCountError("");

    const eventValue = event.currentTarget.value;
    const eventValueAsInt = parseInt(eventValue);

    if (!Object.keys(SHIP_COUNTS_MAX).includes(shipKey)) {
      setShipsCountError("Invalid ship key.");
      return;
    }

    if (Number.isNaN(eventValueAsInt)) {
      setShipsCountError("Input values must be numbers.");
      return;
    }

    if (GameSettings.isShipCountValid(shipKey, eventValueAsInt)) {
      setShipCounts((oldState) => ({
        ...oldState,
        [shipKey]: eventValueAsInt,
      }));
    } else {
      setShipsCountError(
        `${shipDisplayName} count must be between 0 and ${SHIP_COUNTS_MAX[shipKey]}.`
      );
    }
  };

  const handleSaveSettings = () => {
    let hasError = false;

    if (!player1Name) {
      setPlayer1NameError("Name is required.");
      hasError = true;
    }

    if (!player2Name) {
      setPlayer2NameError("Name is required.");
      hasError = true;
    }

    if (!boardSize) {
      setBoardSizeError("Board size is required.");
      hasError = true;
    }

    const shipCountCheck = GameSettings.isShipCountsValid(
      shipCounts,
      boardSize
    );

    if (shipCountCheck !== true) {
      setShipsCountError(shipCountCheck);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const settings = new GameSettings(
      player1Name,
      player2Name,
      boardSize,
      shipCounts
    ).settings;

    setSettings(settings);

    window.location.href = "/game";
  };

  return (
    <article className="homePageContainer">
      <section className="nameInputsContainer">
        <label className="flexLabel">
          Player 1 name
          <input
            type="text"
            value={player1Name}
            onChange={(event) => handleInputChange(event, "player1Name")}
          />
        </label>
        {player1NameError}

        <label className="flexLabel">
          Player 2 name
          <input
            type="text"
            value={player2Name}
            onChange={(event) => handleInputChange(event, "player2Name")}
          />
        </label>
      </section>
      {player2NameError}

      <section className="numberInputsContainer">
        <label className="flexLabel">
          Board size
          <input
            type="number"
            value={boardSize}
            onChange={(event) => handleInputChange(event, "boardSize")}
            min={BOARD_SIZE_MIN}
            max={BOARD_SIZE_MAX}
          />
        </label>
        {boardSizeError}

        <label className="flexLabel">
          Carrier ship count (0 - {SHIP_COUNTS_MAX.carriers})
          <input
            type="number"
            value={shipCounts.carriers || 0}
            onChange={(event) =>
              handleShipCountChange(event, "carriers", "Carrier")
            }
            min={0}
            max={SHIP_COUNTS_MAX.carriers}
          />
        </label>

        <label className="flexLabel">
          Battleship ship count (0 - {SHIP_COUNTS_MAX.battleships})
          <input
            type="number"
            value={shipCounts.battleships || 0}
            onChange={(event) =>
              handleShipCountChange(event, "battleships", "Battleship")
            }
            min={0}
            max={SHIP_COUNTS_MAX.battleships}
          />
        </label>

        <label className="flexLabel">
          Cruiser ship count (0 - {SHIP_COUNTS_MAX.cruisers})
          <input
            type="number"
            value={shipCounts.cruisers || 0}
            onChange={(event) =>
              handleShipCountChange(event, "cruisers", "Cruiser")
            }
            min={0}
            max={SHIP_COUNTS_MAX.cruisers}
          />
        </label>

        <label className="flexLabel">
          Submarine ship count (0 - {SHIP_COUNTS_MAX.submarines})
          <input
            type="number"
            value={shipCounts.submarines || 0}
            onChange={(event) =>
              handleShipCountChange(event, "submarines", "Submarine")
            }
            min={0}
            max={SHIP_COUNTS_MAX.submarines}
          />
        </label>

        <label className="flexLabel">
          Destroyer ship count (0 - {SHIP_COUNTS_MAX.destroyers})
          <input
            type="number"
            value={shipCounts.destroyers || 0}
            onChange={(event) =>
              handleShipCountChange(event, "destroyers", "Destroyer")
            }
            min={0}
            max={SHIP_COUNTS_MAX.destroyers}
          />
        </label>

        {shipsCountError}
      </section>

      <button type="button" onClick={handleSaveSettings}>
        Save settings
      </button>
    </article>
  );
};
