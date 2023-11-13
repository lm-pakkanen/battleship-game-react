import { createContext, useState } from "react";
import { GameSettings, SHIP_SIZES } from "../constructors/GameSettings";
import { ShipType } from "../enums/ShipType";
import { ShipOrientation } from "../enums/ShipOrientation";
import { BlockPanel } from "../components/game/parts/block-panel";

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
    blockPanel: {
      props: BlockPanel;
      isVisible: boolean;
      setProps: React.Dispatch<React.SetStateAction<BlockPanel>>;
      setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    };
  };
  functions: {
    setStage: React.Dispatch<React.SetStateAction<GameContext["stage"]>>;
    setSettings: React.Dispatch<React.SetStateAction<GameContext["settings"]>>;
    setTurn: React.Dispatch<React.SetStateAction<GameContext["turn"]>>;
    setPlayer1: React.Dispatch<React.SetStateAction<GameContext["player1"]>>;
    setPlayer2: React.Dispatch<React.SetStateAction<GameContext["player2"]>>;
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
    blockPanel: {
      props: {
        timer: null,
        children: null,
        onTimerEnd: () => undefined,
      },
      isVisible: false,
      setProps: () => undefined,
      setIsVisible: () => undefined,
    },
  },
  functions: {
    setStage: () => undefined,
    setSettings: () => undefined,
    setTurn: () => undefined,
    setPlayer1: () => undefined,
    setPlayer2: () => undefined,
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

  const [blockPanelProps, setBlockPanelProps] = useState(
    initialGameContext.components.blockPanel.props
  );

  const [isBlockPanelVisible, setIsBlockPanelVisible] = useState(
    initialGameContext.components.blockPanel.isVisible
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

    const currentShipCount = playerState.shipLocations.length;

    const maxShipCount = Object.values(settings.shipCounts).reduce(
      (a, b) => a + b
    );

    setPlayerState((oldState) => ({
      ...oldState,
      shipLocations: [
        ...oldState.shipLocations,
        { shipType, coordinates: nextCoordinates },
      ],
    }));

    if (currentShipCount + 1 === maxShipCount) {
      const onTimerEnd = () => {
        if (turn === "player1") {
          setTurn("player2");
        } else {
          setStage("playing");
          setTurn("player1");
        }
      };

      setBlockPanelProps({
        timer: 5000,
        children: "test",
        onTimerEnd,
      });

      setIsBlockPanelVisible(true);
    }
  };

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
      blockPanel: {
        props: blockPanelProps,
        isVisible: isBlockPanelVisible,
        setProps: setBlockPanelProps,
        setIsVisible: setIsBlockPanelVisible,
      },
    },
    functions: {
      setStage,
      setSettings,
      setTurn,
      setPlayer1,
      setPlayer2,
      placeShip,
    },
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};
