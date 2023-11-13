import { GameContext } from "../context/game-context";

export const transformName = (
  turn: Exclude<GameContext["turn"], undefined | null>
) => {
  const [firstLetter, ...otherLetters] = turn;
  const transformedTurn = [firstLetter.toUpperCase(), ...otherLetters].join("");
  return transformedTurn;
};
