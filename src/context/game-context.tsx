import { createContext, useEffect, useMemo, useState } from "react";
import { GameSettings, SHIP_SIZES } from "../constructors/GameSettings";
import { ShipType } from "../enums/ShipType";
import { ShipOrientation } from "../enums/ShipOrientation";
import { BlockPanel } from "../components/game/parts/block-panel";
import { useMemory } from "../hooks/useMemory";
import { ShipLocation } from "../components/game/parts/ships/ship";
import { playSound } from "../functions/play-sound";
import { SoundEffect } from "../enums/SoundEffect";
import { ResetGameButton } from "../components/controls/reset-game-button";

export interface PlayerState {
  hitCells: string[];
  shipLocations: {
    shipType: ShipType;
    coordinates: string[];
  }[];
}

export interface GameContext {
  stage: "settings" | "placingShips" | "playing" | "gameOver";
  settings: GameSettings["settings"];
  player1: PlayerState;
  player2: PlayerState;
  turn: null | "player1" | "player2";
  allShipsSunk: boolean;
  tileBounds: Record<
    string,
    {
      id: string;
      xBounds: [number, number];
      yBounds: [number, number];
    }
  >;
  setTileBounds: React.Dispatch<
    React.SetStateAction<GameContext["tileBounds"]>
  >;
  components: {
    header: {
      content: React.ReactNode;
      setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    };
    blockPanel: {
      props: BlockPanel;
      setProps: React.Dispatch<React.SetStateAction<BlockPanel>>;
    };
  };
  functions: {
    setStage: React.Dispatch<React.SetStateAction<GameContext["stage"]>>;
    setSettings: React.Dispatch<React.SetStateAction<GameContext["settings"]>>;
    setTurn: React.Dispatch<React.SetStateAction<GameContext["turn"]>>;
    setPlayer1: React.Dispatch<React.SetStateAction<GameContext["player1"]>>;
    setPlayer2: React.Dispatch<React.SetStateAction<GameContext["player2"]>>;
    placeShip: (
      coordinate: undefined | string,
      shipType: ShipType,
      shipOrientation: ShipOrientation
    ) => boolean;
    getIntersectingTileId: (location: ShipLocation) => undefined | string;
    endGame: (nextHitCells?: string[]) => void;
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
  allShipsSunk: false,
  tileBounds: {},
  setTileBounds: () => undefined,
  components: {
    header: {
      content: null,
      setContent: () => undefined,
    },
    blockPanel: {
      props: {
        id: "initial",
        isVisible: false,
        timer: null,
        children: null,
        onTimerEnd: () => undefined,
      },
      setProps: () => undefined,
    },
  },
  functions: {
    setStage: () => undefined,
    setSettings: () => undefined,
    setTurn: () => undefined,
    setPlayer1: () => undefined,
    setPlayer2: () => undefined,
    placeShip: () => false,
    getIntersectingTileId: () => undefined,
    endGame: () => undefined,
  },
};

export const GameContext = createContext<GameContext>(initialGameContext);

export const GameContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getContext, setContext } = useMemory();

  const savedContext = getContext();

  const [stage, setStage] = useState(savedContext.stage);

  const [settings, setSettings] = useState(savedContext.settings);
  const [player1, setPlayer1] = useState(savedContext.player1);
  const [player2, setPlayer2] = useState(savedContext.player2);
  const [turn, setTurn] = useState(savedContext.turn);

  const [tileBounds, setTileBounds] = useState(initialGameContext.tileBounds);

  const [headerContent, setHeaderContent] = useState(
    initialGameContext.components.header.content
  );

  const [blockPanelProps, setBlockPanelProps] = useState(
    initialGameContext.components.blockPanel.props
  );

  const allShipsSunk = useMemo(() => {
    const p1Coordinates = player1.shipLocations
      .map((ship) => ship.coordinates)
      .flat();

    const p2Coordinates = player2.shipLocations
      .map((ship) => ship.coordinates)
      .flat();

    const p1HitCells = player1.hitCells;
    const p2HitCells = player2.hitCells;

    const eitherPlayerAllShipsSunk = [
      p1Coordinates.every((n) => p1HitCells.includes(n)),
      p2Coordinates.every((n) => p2HitCells.includes(n)),
    ].some((n) => n);

    return stage === "playing" && eitherPlayerAllShipsSunk;
  }, [player1, player2]);

  const getIntersectingTileId: GameContext["functions"]["getIntersectingTileId"] =
    (location) => {
      const intersectingTile = Object.values(tileBounds).find((n) => {
        const orderedXBounds = n.xBounds.sort((a, b) => a - b);
        const orderedYBounds = n.yBounds.sort((a, b) => a - b);

        const [xMin, xMax] = orderedXBounds;
        const [yMin, yMax] = orderedYBounds;

        return (
          location.left > xMin &&
          location.left < xMax &&
          location.bottom > yMin &&
          location.bottom < yMax
        );
      });

      return intersectingTile?.id;
    };

  const placeShip: GameContext["functions"]["placeShip"] = (
    coordinate,
    shipType,
    shipOrientation
  ) => {
    if (!coordinate) {
      return false;
    }

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
      const blockPanelText =
        turn === "player1"
          ? `Time for ${settings.player2Name} to place ships!`
          : `Time for ${settings.player2Name} to sink your ships!`;

      setBlockPanelProps({
        id: "switching-sides-block-panel-2",
        isVisible: true,
        timer: 5000,
        children: (
          <>
            <span className="block-panel-text">{blockPanelText}</span>
            <span className="block-panel-text">Switching sides...</span>
          </>
        ),
        onPanelVisible: () => {
          if (turn === "player1") {
            setTurn("player2");
          } else {
            setStage("playing");
            setTurn("player1");
          }
        },
        onTimerEnd: () => {
          playSound(SoundEffect.TURN_START);
        },
      });
    }

    return true;
  };

  const endGame: GameContext["functions"]["endGame"] = (nextHitCells) => {
    if (!["playing", "gameOver"].includes(stage)) {
      throw new Error("Invalid stage for ending game.");
    }

    const p1Coordinates = player1.shipLocations
      .map((ship) => ship.coordinates)
      .flat();

    const p2Coordinates = player2.shipLocations
      .map((ship) => ship.coordinates)
      .flat();

    const p1HitCells =
      turn === "player1" || !nextHitCells ? player1.hitCells : nextHitCells;

    const p2HitCells =
      turn === "player2" || !nextHitCells ? player2.hitCells : nextHitCells;

    const allShipsSunk = [
      p1Coordinates.every((n) => p1HitCells.includes(n)),
      p2Coordinates.every((n) => p2HitCells.includes(n)),
    ].some((n) => n);

    if (!allShipsSunk) {
      throw new Error("Not all ships are sunk yet!");
    }

    const playerName =
      turn === "player1" ? settings.player1Name : settings.player2Name;

    setBlockPanelProps({
      id: "game-over-block-panel",
      isVisible: true,
      children: (
        <>
          <span className="block-panel-text game-win-text">
            Winner: {playerName}!
          </span>
          <ResetGameButton isEndGameScreen={true} />
        </>
      ),
      timer: null,
      onShow: () => {
        setStage("gameOver");
      },
    });
  };

  useEffect(() => {
    if ((stage === "gameOver" && !blockPanelProps.isVisible) || allShipsSunk) {
      endGame();
    }
  }, [stage, blockPanelProps.isVisible, allShipsSunk]);

  const providerValue: GameContext = {
    stage,
    settings,
    player1,
    player2,
    turn,
    allShipsSunk,
    tileBounds,
    setTileBounds,
    components: {
      header: {
        content: headerContent,
        setContent: setHeaderContent,
      },
      blockPanel: {
        props: blockPanelProps,
        setProps: setBlockPanelProps,
      },
    },
    functions: {
      setStage,
      setSettings,
      setTurn,
      setPlayer1,
      setPlayer2,
      placeShip,
      getIntersectingTileId,
      endGame,
    },
  };

  useEffect(() => {
    setContext({
      stage: providerValue.stage,
      turn: providerValue.turn,
      player1: providerValue.player1,
      player2: providerValue.player2,
    });
  }, [
    providerValue.stage,
    providerValue.turn,
    providerValue.player1,
    providerValue.player2,
  ]);

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};
