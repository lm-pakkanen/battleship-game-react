import { useEffect, useRef, useState } from "react";
import { ShipOrientation } from "../../../../enums/ShipOrientation";
import { useGameContext } from "../../../../hooks/useGameContex";
import { ShipType } from "../../../../enums/ShipType";
import { addAlert } from "../../../../functions/add-alert";
import { Battleship } from "./battleship";
import { EventEmitter } from "events";
import "./ship.css";

export interface ShipLocation {
  top: number;
  left: number;
}

export interface Ship {
  type: ShipType;
  destroyed: boolean;
  isTray: boolean;
  initialOrientation: ShipOrientation;
}

export const Ship = ({ type, destroyed, isTray, initialOrientation }: Ship) => {
  const { player1, player2, functions, tileBounds } = useGameContext();

  const [classNames, setClassNames] = useState<string[]>([]);

  const [orientation, setOrientation] =
    useState<ShipOrientation>(initialOrientation);

  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState<null | ShipLocation>(null);

  const dragEmitter = useRef(new EventEmitter());

  const initialLocation = useRef<null | ShipLocation>(null);
  const shipRef = useRef<HTMLDivElement>(null);

  const handleRotate = () => {
    setOrientation((oldState) =>
      oldState === ShipOrientation.BOTTOM_TO_TOP
        ? ShipOrientation.RIGHT_TO_LEFT
        : ShipOrientation.BOTTOM_TO_TOP
    );
  };

  const handleDrag = (event: MouseEvent) => {
    setIsDragging(true);

    setLocation((currentLocation) => {
      if (!currentLocation) {
        return currentLocation;
      }

      const verticalYCorrection = -290;
      const verticalXCorrection = -30;

      return {
        top: event.clientY + verticalYCorrection,
        left: event.clientX + verticalXCorrection,
      };
    });
  };

  const handleDragStart = () => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("keydown", handleRotate);
    document.addEventListener("mousedown", handleDragEndEvent);
    document.addEventListener("mouseup", handleDragEndEvent);

    dragEmitter.current.on("dragend", () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("keydown", handleRotate);
      document.removeEventListener("mouseup", handleDragEndEvent);
      document.removeEventListener("mousedown", handleDragEndEvent);
    });
  };

  const handleDragStartEvent = (event: MouseEvent) => {
    event.stopPropagation();
    dragEmitter.current.emit("dragstart", event);
  };

  const handleDragEndEvent = (event: MouseEvent) => {
    dragEmitter.current.emit("dragend", event);
  };

  const handleDragEnd = (event: MouseEvent) => {
    const location: ShipLocation = {
      top: event.clientY,
      left: event.clientX,
    };

    const intersectingTile = functions.getIntersectingTileId(location);

    try {
      const success = functions.placeShip(intersectingTile, type, orientation);

      if (!success) {
        setLocation(initialLocation.current);
      }
    } catch (err) {
      console.log(err);
      addAlert((err as Error).message);
      setLocation(initialLocation.current);
    } finally {
      setIsDragging(false);
      setOrientation(ShipOrientation.BOTTOM_TO_TOP);
    }
  };

  useEffect(() => {
    const nextClassNames: string[] = ["ship"];

    if (isTray) {
      nextClassNames.push("tray-ship");
    }

    if (isDragging) {
      nextClassNames.push("dragging");
    }

    if (orientation === ShipOrientation.BOTTOM_TO_TOP) {
      nextClassNames.push("ship-vertical");
    } else if (orientation === ShipOrientation.RIGHT_TO_LEFT) {
      nextClassNames.push("ship-horizontal");
    }

    setClassNames(nextClassNames);
  }, [orientation, isDragging]);

  useEffect(() => {
    if (!isTray || !shipRef.current) {
      return;
    }

    const parentElementRect =
      shipRef.current.parentElement?.getBoundingClientRect();

    const _initialLocation: ShipLocation = {
      top: parentElementRect?.top ?? 0,
      left: parentElementRect?.left ?? 0,
    };

    console.log(_initialLocation);

    initialLocation.current = _initialLocation;
    setLocation(_initialLocation);
  }, [
    shipRef.current?.parentElement?.getBoundingClientRect()?.left,
    isTray,
    player1,
    player2,
  ]);

  useEffect(() => {
    if (!isTray || !shipRef.current) {
      return;
    }

    shipRef.current.addEventListener("mousedown", handleDragStartEvent);

    return () => {
      if (shipRef.current) {
        shipRef.current.removeEventListener("mousedown", handleDragStartEvent);
      }
    };
  }, [shipRef.current, isTray]);

  useEffect(() => {
    if (!isTray) {
      return;
    }

    dragEmitter.current.on("dragstart", handleDragStart);

    return () => {
      dragEmitter.current.off("dragstart", handleDragStart);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("keydown", handleRotate);
      document.removeEventListener("mouseup", handleDragEndEvent);
      document.removeEventListener("mousedown", handleDragEndEvent);
    };
  }, [isTray]);

  useEffect(() => {
    if (!isTray || !tileBounds) {
      return;
    }

    dragEmitter.current.on("dragend", handleDragEnd);

    return () => {
      dragEmitter.current.off("dragend", handleDragEnd);
    };
  }, [orientation, isTray, tileBounds]);

  return (
    <div
      className={classNames.join(" ")}
      ref={shipRef}
      style={{
        ...(location ?? { top: 0, right: 0 }),
      }}
    >
      {type === ShipType.BATTLESHIP ? (
        <Battleship destroyed={destroyed} />
      ) : null}
    </div>
  );
};
