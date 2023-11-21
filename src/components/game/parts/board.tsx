import { useEffect, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { Tile } from "./tile";
import "./board.css";

const ROW_NAME_LETTERS = "ABCDEFGHIJ";

export const Board = () => {
  const { stage, turn, settings, player1, player2, functions, components } =
    useGameContext();

  const [rowNames, setRowNames] = useState<string[]>([]);
  const [columnNumbers, setColumnNumbers] = useState<number[]>([]);

  const [hasGuessesLeft, setHasGuessesLeft] = useState(false);

  const handleClick = (coordinate: string) => {
    if (stage !== "playing" || !turn || !hasGuessesLeft) {
      return;
    }

    const oppositeState = turn === "player1" ? player2 : player1;

    const setOppositePlayer =
      turn === "player1" ? functions.setPlayer2 : functions.setPlayer1;

    if (oppositeState.hitCells.some((n) => n === coordinate)) {
      alert("Already guessed!");
    }

    const shouldChangeTurn = !oppositeState.shipLocations.some((n) =>
      n.coordinates.includes(coordinate)
    );

    setOppositePlayer((oldState) => ({
      ...oldState,
      hitCells: [...oldState.hitCells, coordinate],
    }));

    if (shouldChangeTurn) {
      setHasGuessesLeft(false);

      const onTimerEnd = () => {
        functions.setTurn((oldState) =>
          oldState === "player1" ? "player2" : "player1"
        );
      };

      setTimeout(() => {
        components.blockPanel.setProps({
          isVisible: true,
          timer: null, //5000,
          textContent: "Switching sides!",
          onTimerEnd,
        });
      }, 2000);
    }
  };

  useEffect(() => {
    const nextRowNames: string[] = [];

    for (let i = 0; i < settings.boardSize; i++) {
      nextRowNames.push(ROW_NAME_LETTERS[i]);
    }

    const nextColumnNumbers = [...Array(settings.boardSize).keys()].map(
      (n) => n + 1
    );

    setRowNames(nextRowNames);
    setColumnNumbers(nextColumnNumbers);
  }, [settings.boardSize]);

  useEffect(() => {
    setHasGuessesLeft(true);
  }, [turn]);

  return (
    <article className="board">
      <div className="board-overlay" />
      {rowNames.map((rowName) => (
        <div className="tile-row" key={`row-${rowName}`}>
          {columnNumbers.map((columnNumber) => (
            <Tile
              key={`${rowName}${columnNumber}`}
              coordinate={`${rowName}${columnNumber}`}
              handleClick={handleClick}
            />
          ))}
        </div>
      ))}
    </article>
  );
};
