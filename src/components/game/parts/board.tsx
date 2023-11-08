import { useEffect, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { Tile } from "./tile";
import "./board.css";

const ROW_NAME_LETTERS = "ABCDEFGHIJ";

export const Board = () => {
  const { settings } = useGameContext();

  const [rowNames, setRowNames] = useState<string[]>([]);
  const [columnNumbers, setColumnNumbers] = useState<number[]>([]);

  useEffect(() => {
    const nextRowNames: string[] = [];

    for (let i = 0; i < settings.boardSize; i++) {
      nextRowNames.push(ROW_NAME_LETTERS[i]);
    }

    setRowNames(nextRowNames);
    setColumnNumbers([...Array(settings.boardSize).keys()].map((n) => n + 1));
  }, [settings.boardSize]);

  return (
    <article className="board">
      {rowNames.map((rowName) => (
        <div className="tile-row" key={`row-${rowName}`}>
          {columnNumbers.map((columnNumber) => (
            <Tile
              key={`${rowName}${columnNumber}`}
              coordinate={`${rowName}${columnNumber}`}
              handleClick={() => undefined}
              isGuessed={false}
            />
          ))}
        </div>
      ))}
    </article>
  );
};
