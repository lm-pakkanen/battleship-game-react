import { createContext, useState } from "react";
import { GameSettings, SHIP_SIZES } from "../constructors/GameSettings";
import { ShipType } from "../enums/ShipType";
import { ShipOrientation } from "../enums/ShipOrientation";

interface PlayerState {
  hitCells: string[];
  shipLocations: {
    shipType: ShipType;
    coordinates: string[];
  }[];
}

export interface GameContext {
  stage: "settings" | "placingShips" | "playing";
  settings: GameSettings["settings"];
  player1: PlayerState;
  player2: PlayerState;
  turn: null | "player1" | "player2";
  components: {
    header: {
      content: React.ReactNode;
      setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    };
  };
  functions: {
    setStage: React.Dispatch<React.SetStateAction<GameContext["stage"]>>;
    setSettings: React.Dispatch<React.SetStateAction<GameContext["settings"]>>;
    setTurn: React.Dispatch<React.SetStateAction<GameContext["turn"]>>;
    placeShip: (
      coordinate: string,
      shipType: ShipType,
      shipOrientation: ShipOrientation
    ) => void;
  };
}

export const initialGameContext: GameContext = {
  stage: "settings",
  settings: {
    player1Name: "",
    player2Name: "",
    boardSize: 0,
    shipCounts: {
      carrier: 0,
      battleship: 0,
      cruiser: 0,
      submarine: 0,
      destroyer: 0,
    },
  },
  player1: {
    hitCells: [],
    shipLocations: [],
  },
  player2: {
    hitCells: [],
    shipLocations: [],
  },
  turn: null,
  components: {
    header: {
      content: "",
      setContent: () => undefined,
    },
  },
  functions: {
    setStage: () => undefined,
    setSettings: () => undefined,
    setTurn: () => undefined,
    placeShip: () => undefined,
  },
};

export const GameContext = createContext<GameContext>(initialGameContext);

export const GameContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stage, setStage] = useState(initialGameContext.stage);

  const [settings, setSettings] = useState(initialGameContext.settings);
  const [player1, setPlayer1] = useState(initialGameContext.player1);
  const [player2, setPlayer2] = useState(initialGameContext.player2);
  const [turn, setTurn] = useState(initialGameContext.turn);
  const [headerContent, setHeaderContent] = useState(
    initialGameContext.components.header.content
  );

  const placeShip: GameContext["functions"]["placeShip"] = (
    coordinate,
    shipType,
    shipOrientation
  ) => {
    if (!turn) {
      throw new Error("Placing ships not yet started!");
    }

    if (stage !== "placingShips") {
      throw new Error("Invalid stage for placing ships.");
    }

    const playerState = turn === "player1" ? player1 : player2;
    const setPlayerState = turn === "player1" ? setPlayer1 : setPlayer2;

    const shipTypeCount = playerState.shipLocations.filter(
      (n) => n.shipType === shipType
    ).length;

    if (shipTypeCount >= settings.shipCounts[shipType]) {
      throw new Error(`All ${shipType} ships are already placed!`);
    }

    const nextCoordinates: string[] = [];

    const shipSize = SHIP_SIZES[shipType];

    switch (shipOrientation) {
      case ShipOrientation.BOTTOM_TO_TOP: {
        const [bottomLetter, columnNumber] = coordinate;

        const bottomLetterAsNumber = bottomLetter.charCodeAt(0);

        const topLetterAsNumber = Number.isNaN(bottomLetterAsNumber)
          ? NaN
          : bottomLetterAsNumber - shipSize + 1;

        if (
          Number.isNaN(bottomLetterAsNumber) ||
          bottomLetterAsNumber >= settings.boardSize + 65 ||
          Number.isNaN(topLetterAsNumber) ||
          topLetterAsNumber < 65
        ) {
          throw new Error("Invalid location");
        }

        const lettersArray = [...Array(shipSize).keys()].map((n) => {
          const nextNumber = n + topLetterAsNumber;
          return String.fromCharCode(nextNumber);
        });

        nextCoordinates.push(...lettersArray.map((n) => `${n}${columnNumber}`));
        break;
      }

      case ShipOrientation.RIGHT_TO_LEFT: {
        const [rowLetter, rightNumberAsString] = coordinate;

        const rightNumber = parseInt(rightNumberAsString);
        const leftNumber = Number.isNaN(rightNumber)
          ? NaN
          : rightNumber - shipSize + 1;

        if (
          Number.isNaN(rightNumber) ||
          rightNumber > settings.boardSize ||
          Number.isNaN(leftNumber) ||
          leftNumber < 1
        ) {
          throw new Error("Invalid location");
        }

        const lettersArray = Array(rightNumber - leftNumber + 1).fill(
          rowLetter
        );

        nextCoordinates.push(
          ...lettersArray.map((n, index) => `${n}${leftNumber + index}`)
        );

        break;
      }

      default: {
        throw new Error("Unsupported orientation.");
      }
    }

    const playerCoordinates = playerState.shipLocations
      .map((n) => n.coordinates)
      .flat();

    if (nextCoordinates.length !== shipSize) {
      throw new Error("Ship coordinates were calculated incorrectly!");
    }

    if (nextCoordinates.some((n) => playerCoordinates.includes(n))) {
      throw new Error("Space is already occupied by another ship!");
    }

    setPlayerState((oldState) => ({
      ...oldState,
      shipLocations: [
        ...oldState.shipLocations,
        { shipType, coordinates: nextCoordinates },
      ],
    }));
  };

  console.log(player1.shipLocations);

  const providerValue: GameContext = {
    stage,
    settings,
    player1,
    player2,
    turn,
    components: {
      header: {
        content: headerContent,
        setContent: setHeaderContent,
      },
    },
    functions: {
      setStage,
      setSettings,
      setTurn,
      placeShip,
    },
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};
