import { useEffect, useRef } from "react";
import "./instructions-modal.css";

export interface InstructionsModal {
  isVisible: boolean;
  setIsVisible: React.Dispatch<
    React.SetStateAction<InstructionsModal["isVisible"]>
  >;
}

export const InstructionsModal = ({
  isVisible,
  setIsVisible,
}: InstructionsModal) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isVisible]);

  return (
    <dialog
      className="instructions-modal"
      onClick={handleClick}
      ref={dialogRef}
    >
      <article className="instructions-modal-content">
        <section>
          <h2>Placing ships</h2>
          <p>
            Ships can be placed by dragging ships from the tray below the game
            board.
          </p>
          <p>
            Ships can also be placed by focusing the ship via the tabulator
            (Tab-key) and by using the arrow keys to move the ship around the
            game area.
          </p>
          <p>
            Regardless of the method of dragging, the ship can be rotated with
            the "r" key.
          </p>
        </section>
        <section>
          <h2>Sinking ships</h2>
          <p>
            Ships can be sunk by clicking on a board tile. If the guess hits a
            piece of a ship, the tile will be marked by a red X. Otherwise the
            tile will be marked with a white X.
          </p>
          <p>
            Guesses can also be made by focusing the wanted tile via the
            tabulator (Tab-key) and by pressing the Enter-key.
          </p>
          <p>
            Upon hitting a part of a ship, the player is granted another guess.
            If the guess misses, the turn is passed to the opponent.
          </p>
          <p>
            The opponent's current ship counts are displayed below the board.
            When a ship is completely sunk (all of it's tiles have been
            quessed), the ship count of will be deducted by one.
          </p>
          <p>When all the ships of a player are sunk, the game ends.</p>
        </section>
      </article>
    </dialog>
  );
};
