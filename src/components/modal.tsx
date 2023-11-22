import { useCallback, useEffect, useRef } from "react";
import "./modal.css";

export interface Dialog {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Dialog = ({ isVisible, setIsVisible }: Dialog) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const classNames = ["modal"];

  if (isVisible) {
    classNames.push("modal-visible");
  }

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (event.currentTarget !== dialogRef.current) {
        setIsVisible(false);
      }
    },
    [dialogRef.current]
  );

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    window.addEventListener("click", handleClick);

    return () => {
      if (dialogRef.current) {
        window.removeEventListener("click", handleClick);
      }
    };
  }, [dialogRef.current]);

  return <article className={classNames.join(" ")}>asd</article>;
};
