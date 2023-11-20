import { useState } from "react";
import { useMemory } from "../../hooks/useMemory";
import {
  BOARD_SIZE_MAX,
  BOARD_SIZE_MIN,
  GameSettings,
  SHIP_COUNTS_MAX,
} from "../../constructors/GameSettings";
import { Layout } from "../layout";
import { ErrorMessage } from "./parts/error-message";
import { ShipCountSelector } from "./parts/ship-count-selector";
import { ShipType } from "../../enums/ShipType";
import { InputLabel } from "./parts/input-label";
import { SaveSettingsButton } from "../controls/save-settings-button";
import { FlexLabel } from "./parts/flex-label";

export const HomeContent = () => {
  const { setSettings } = useMemory();

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [boardSize, setBoardSize] = useState<"" | number>(
    Math.floor((BOARD_SIZE_MIN + BOARD_SIZE_MAX) / 2)
  );

  const [shipCounts, setShipCounts] = useState<
    GameSettings["settings"]["shipCounts"]
  >({
    carrier: 1,
    battleship: 2,
    cruiser: 2,
    submarine: 2,
    destroyer: 2,
  });

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

        setBoardSize((oldValue) =>
          eventValue === ""
            ? eventValue
            : !Number.isNaN(asInt)
            ? asInt
            : oldValue
        );

        break;
      }
    }
  };

  const handleShipCountChange = (
    count: number,
    shipKey: keyof GameSettings["settings"]["shipCounts"],
    shipDisplayName: string
  ) => {
    setShipsCountError("");

    if (!Object.keys(SHIP_COUNTS_MAX).includes(shipKey)) {
      setShipsCountError("Invalid ship key.");
      return;
    }

    if (Number.isNaN(count)) {
      setShipsCountError("Input values must be numbers.");
      return;
    }

    if (GameSettings.isShipCountValid(shipKey, count)) {
      setShipCounts((oldState) => ({
        ...oldState,
        [shipKey]: count,
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

    if (!boardSize || !GameSettings.isBoardSizeValid(boardSize)) {
      setBoardSizeError(
        `Board size must be between ${BOARD_SIZE_MIN} and ${BOARD_SIZE_MAX}.`
      );
      hasError = true;
    }

    const shipCountCheck = GameSettings.isShipCountsValid(
      shipCounts,
      boardSize as number
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
      boardSize as number,
      shipCounts
    ).settings;

    setSettings(settings);

    window.location.href = "/game";
  };

  return (
    <Layout>
      <article className="home-page-container">
        <section className="name-inputs-container">
          <FlexLabel>
            <InputLabel label="Player 1 name" />
            <input
              type="text"
              value={player1Name}
              onChange={(event) => handleInputChange(event, "player1Name")}
            />
            <ErrorMessage msg={player1NameError} isInputError={true} />
          </FlexLabel>

          <FlexLabel>
            <InputLabel label="Player 2 name" />
            <input
              type="text"
              value={player2Name}
              onChange={(event) => handleInputChange(event, "player2Name")}
            />
            <ErrorMessage msg={player2NameError} isInputError={true} />
          </FlexLabel>
        </section>

        <section className="number-inputs-container">
          <FlexLabel>
            <InputLabel
              label={`Board size NxN (N = ${BOARD_SIZE_MIN}-${BOARD_SIZE_MAX})`}
            />
            <input
              type="number"
              value={boardSize}
              onChange={(event) => handleInputChange(event, "boardSize")}
              min={BOARD_SIZE_MIN}
              max={BOARD_SIZE_MAX}
            />
          </FlexLabel>

          <ErrorMessage msg={boardSizeError} isInputError={true} />

          <section className="ship-counts-container">
            <FlexLabel>
              <InputLabel label="Destroyer ship count" />
              <ShipCountSelector
                shipType={ShipType.DESTROYER}
                maxCount={SHIP_COUNTS_MAX.destroyer}
                selectedCount={shipCounts.destroyer}
                setSelectedCount={(count) =>
                  handleShipCountChange(count, ShipType.DESTROYER, "Destroyer")
                }
              />
            </FlexLabel>

            <FlexLabel>
              <InputLabel label="Submarine ship count" />
              <ShipCountSelector
                shipType={ShipType.SUBMARINE}
                maxCount={SHIP_COUNTS_MAX.submarine}
                selectedCount={shipCounts.submarine}
                setSelectedCount={(count) =>
                  handleShipCountChange(count, ShipType.SUBMARINE, "Submarine")
                }
              />
            </FlexLabel>

            <FlexLabel>
              <InputLabel label="Cruiser ship count" />
              <ShipCountSelector
                shipType={ShipType.CRUISER}
                maxCount={SHIP_COUNTS_MAX.cruiser}
                selectedCount={shipCounts.cruiser}
                setSelectedCount={(count) =>
                  handleShipCountChange(count, ShipType.CRUISER, "Cruiser")
                }
              />
            </FlexLabel>

            <FlexLabel>
              <InputLabel label="Battleship count" />
              <ShipCountSelector
                shipType={ShipType.BATTLESHIP}
                maxCount={SHIP_COUNTS_MAX.battleship}
                selectedCount={shipCounts.battleship}
                setSelectedCount={(count) =>
                  handleShipCountChange(
                    count,
                    ShipType.BATTLESHIP,
                    "Battleship"
                  )
                }
              />
            </FlexLabel>

            <FlexLabel>
              <InputLabel label="Carrier ship count" />
              <ShipCountSelector
                shipType={ShipType.CARRIER}
                maxCount={SHIP_COUNTS_MAX.carrier}
                selectedCount={shipCounts.carrier}
                setSelectedCount={(count) =>
                  handleShipCountChange(count, ShipType.CARRIER, "Carrier")
                }
              />
            </FlexLabel>
          </section>
          <ErrorMessage msg={shipsCountError} />
        </section>

        <SaveSettingsButton handleSaveSettings={handleSaveSettings} />
      </article>
    </Layout>
  );
};
