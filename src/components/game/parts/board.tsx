import { useMemo, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { Tile } from "./tile";
import { playSound } from "../../../functions/play-sound";
import { SoundEffect } from "../../../enums/SoundEffect";
import "./board.css";

const ROW_NAME_LETTERS = "ABCDEFGHIJ";

export const Board = () => {
  const { stage, turn, settings, player1, player2, functions, components } =
    useGameContext();

  const [hasGuessesLeft, setHasGuessesLeft] = useState(true);

  const {
    rowNames,
    columnNumbers,
  }: {
    rowNames: string[];
    columnNumbers: number[];
  } = useMemo(() => {
    const nextRowNames = [];

    for (let i = 0; i < settings.boardSize; i++) {
      nextRowNames.push(ROW_NAME_LETTERS[i]);
    }

    const nextColumnNumbers = [...Array(settings.boardSize).keys()].map(
      (n) => n + 1
    );

    return {
      rowNames: nextRowNames,
      columnNumbers: nextColumnNumbers,
    };
  }, [settings.boardSize, ROW_NAME_LETTERS]);

  const handleClick = (coordinate: string) => {
    if (stage !== "playing" || !turn || !hasGuessesLeft) {
      return;
    }

    const oppositeState = turn === "player1" ? player2 : player1;

    const setOppositePlayer =
      turn === "player1" ? functions.setPlayer2 : functions.setPlayer1;

    if (oppositeState.hitCells.some((n) => n === coordinate)) {
      alert("Already guessed!");
      return;
    }

    const hasHitShip = oppositeState.shipLocations.some((n) =>
      n.coordinates.includes(coordinate)
    );

    if (hasHitShip) {
      playSound(SoundEffect.GUESS_HIT);
    } else {
      playSound(SoundEffect.GUESS_MISS);
    }

    const nextHitCells = [...oppositeState.hitCells, coordinate];

    setOppositePlayer((oldState) => ({
      ...oldState,
      hitCells: nextHitCells,
    }));

    if (!hasHitShip) {
      setHasGuessesLeft(false);

      setTimeout(() => {
        components.blockPanel.setProps({
          isVisible: true,
          timer: 5000,
          children: "Switching sides...",
          onPanelVisible() {
            functions.setTurn((oldState) =>
              oldState === "player1" ? "player2" : "player1"
            );
          },
          onTimerEnd: () => {
            playSound(SoundEffect.TURN_START);
          },
        });
      }, 2000);
    }
  };

  return (
    <article className="board">
      <div className="board-overlay" />
      {rowNames.map((rowName, rowIndex) => {
        return (
          <div className="tile-row" key={`row-${rowName}`}>
            {columnNumbers.map((columnNumber, columnIndex) => {
              const tabIndex =
                rowIndex * columnNumbers.length + columnIndex + 1;

              return (
                <Tile
                  key={`${rowName}${columnNumber}`}
                  coordinate={`${rowName}${columnNumber}`}
                  tabIndex={tabIndex}
                  handleClick={handleClick}
                />
              );
            })}
          </div>
        );
      })}
    </article>
  );
};
