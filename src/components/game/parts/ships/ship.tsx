import { useEffect, useRef, useState } from "react";
import { ShipOrientation } from "../../../../enums/ShipOrientation";
import { useGameContext } from "../../../../hooks/useGameContex";
import { ShipType } from "../../../../enums/ShipType";
import { addAlert } from "../../../../functions/add-alert";
import { Battleship } from "./battleship";
import { EventEmitter } from "events";
import { Submarine } from "./submarine";
import { Carrier } from "./carrier";
import { Cruiser } from "./cruiser";
import { Destroyer } from "./destroyer";
import { getLayoutScrollOffset } from "../../../../functions/get-layout-scroll-offset";
import "./ship.css";

export interface ShipLocation {
  bottom: number;
  left: number;
}

export interface Ship {
  type: ShipType;
  destroyed: boolean;
  isTray: boolean;
  initialOrientation: ShipOrientation;
}

export const Ship = ({ type, destroyed, isTray, initialOrientation }: Ship) => {
  const { functions, tileBounds } = useGameContext();

  const [classNames, setClassNames] = useState<string[]>([]);

  const [orientation, setOrientation] =
    useState<ShipOrientation>(initialOrientation);

  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState<ShipLocation>({
    bottom: 0,
    left: 0,
  });

  const dragEmitter = useRef(new EventEmitter());
  const shipRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("keydown", handleRotate);
    document.addEventListener("mousedown", handleDragEndEvent);
    document.addEventListener("mouseup", handleDragEndEvent);

    const removeEventListenersCallback = () => {
      dragEmitter.current.off("dragend", removeEventListenersCallback);

      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("keydown", handleRotate);
      document.removeEventListener("mouseup", handleDragEndEvent);
      document.removeEventListener("mousedown", handleDragEndEvent);
    };

    dragEmitter.current.on("dragend", removeEventListenersCallback);
  };

  const handleDrag = (event: MouseEvent) => {
    setIsDragging(true);

    const parentElement = shipRef.current!.parentElement!;
    const parentRect = parentElement.getBoundingClientRect();

    console.log(parentElement);

    const verticalYCorrection = -(parentRect.bottom - 25);
    const verticalXCorrection = -(parentRect.left + parentRect.width / 2);

    setLocation({
      bottom: -(event.clientY + verticalYCorrection),
      left: event.clientX + verticalXCorrection,
    });
  };

  const handleRotate = () => {
    setOrientation((oldState) =>
      oldState === ShipOrientation.BOTTOM_TO_TOP
        ? ShipOrientation.RIGHT_TO_LEFT
        : ShipOrientation.BOTTOM_TO_TOP
    );
  };

  const handleDragEnd = (event: MouseEvent) => {
    setIsDragging(false);

    const { scrollOffsetTop, scrollOffsetLeft } = getLayoutScrollOffset();

    const location: ShipLocation = {
      bottom: event.clientY + scrollOffsetTop,
      left: event.clientX + scrollOffsetLeft,
    };

    const intersectingTile = functions.getIntersectingTileId(location);

    try {
      const success = functions.placeShip(intersectingTile, type, orientation);

      if (!success) {
        setLocation({ bottom: 0, left: 0 });
        setOrientation(ShipOrientation.BOTTOM_TO_TOP);
      }
    } catch (err) {
      setLocation({ bottom: 0, left: 0 });
      setOrientation(ShipOrientation.BOTTOM_TO_TOP);
      addAlert((err as Error).message);
    }
  };

  const handleDragStartEvent = (event: MouseEvent) => {
    event.stopPropagation();
    dragEmitter.current.emit("dragstart", event);
  };

  const handleDragEndEvent = (event: MouseEvent) => {
    dragEmitter.current.emit("dragend", event);
  };

  // Calculate ship's class names
  useEffect(() => {
    const nextClassNames: string[] = ["ship"];

    if (isTray) {
      nextClassNames.push("tray-ship");
    }

    if (isDragging) {
      nextClassNames.push("dragging");
    }

    nextClassNames.push(type);

    if (orientation === ShipOrientation.BOTTOM_TO_TOP) {
      nextClassNames.push("ship-vertical");
    } else if (orientation === ShipOrientation.RIGHT_TO_LEFT) {
      nextClassNames.push("ship-horizontal");
    }

    setClassNames(nextClassNames);
  }, [type, orientation, isDragging]);

  // Create drag handlers when ship is initially clicked (drag start)
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

  // React to dragstart event
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

  // React to dragend event
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
      ) : type === ShipType.SUBMARINE ? (
        <Submarine destroyed={destroyed} />
      ) : type === ShipType.CARRIER ? (
        <Carrier destroyed={destroyed} />
      ) : type === ShipType.CRUISER ? (
        <Cruiser destroyed={destroyed} />
      ) : type === ShipType.DESTROYER ? (
        <Destroyer destroyed={destroyed} />
      ) : null}
    </div>
  );
};
