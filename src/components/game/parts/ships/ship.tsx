import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [orientation, setOrientation] =
    useState<ShipOrientation>(initialOrientation);

  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState<ShipLocation>({
    bottom: 0,
    left: 0,
  });

  const [touchLocation, setTouchLocation] = useState<null | {
    clientY: number;
    clientX: number;
  }>(null);

  const dragEmitter = useRef(new EventEmitter());
  const shipRef = useRef<HTMLDivElement>(null);

  const children = useMemo(() => {
    switch (type) {
      case ShipType.BATTLESHIP: {
        return <Battleship destroyed={destroyed} />;
      }

      case ShipType.SUBMARINE: {
        return <Submarine destroyed={destroyed} />;
      }

      case ShipType.CARRIER: {
        return <Carrier destroyed={destroyed} />;
      }

      case ShipType.CRUISER: {
        return <Cruiser destroyed={destroyed} />;
      }

      case ShipType.DESTROYER: {
        return <Destroyer destroyed={destroyed} />;
      }

      default: {
        return null;
      }
    }
  }, [type, destroyed]);

  const classNames = useMemo(() => {
    const nextClassNames = ["ship", type];

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

    return nextClassNames;
  }, [isTray, isDragging, type, orientation]);

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!shipRef.current) {
        return;
      }

      setIsDragging(true);

      const parentElement = shipRef.current.parentElement!;
      const parentRect = parentElement.getBoundingClientRect();

      const verticalYCorrection = -(parentRect.bottom - 25);
      const verticalXCorrection = -(parentRect.left + parentRect.width / 2);

      let clientY = 0;
      let clientX = 0;

      if (window.TouchEvent && event instanceof TouchEvent) {
        const touch = event.touches[0];
        clientY = touch.clientY;
        clientX = touch.clientX;
        setTouchLocation({ clientY, clientX });
      } else if (event instanceof MouseEvent) {
        clientY = event.clientY;
        clientX = event.clientX;
      }

      setLocation({
        bottom: -(clientY + verticalYCorrection),
        left: clientX + verticalXCorrection,
      });
    },
    [shipRef.current]
  );

  const handleRotate = useCallback((event: KeyboardEvent | TouchEvent) => {
    if (event instanceof KeyboardEvent && event.key !== "r") {
      return;
    }

    setOrientation((oldState) =>
      oldState === ShipOrientation.BOTTOM_TO_TOP
        ? ShipOrientation.RIGHT_TO_LEFT
        : ShipOrientation.BOTTOM_TO_TOP
    );
  }, []);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      setIsDragging(false);

      const { scrollOffsetTop, scrollOffsetLeft } = getLayoutScrollOffset();

      let clientY = 0;
      let clientX = 0;

      if (window.TouchEvent && event instanceof TouchEvent) {
        const _touchLocation = { ...touchLocation };
        clientY = _touchLocation.clientY || 0;
        clientX = _touchLocation.clientX || 0;
      } else if (event instanceof MouseEvent) {
        clientY = event.clientY;
        clientX = event.clientX;
      }

      const location: ShipLocation = {
        bottom: clientY + scrollOffsetTop,
        left: clientX + scrollOffsetLeft,
      };

      const intersectingTile = functions.getIntersectingTileId(location);

      try {
        const success = functions.placeShip(
          intersectingTile,
          type,
          orientation
        );

        if (!success) {
          setLocation({ bottom: 0, left: 0 });
          setOrientation(ShipOrientation.BOTTOM_TO_TOP);
        }
      } catch (err) {
        setLocation({ bottom: 0, left: 0 });
        setOrientation(ShipOrientation.BOTTOM_TO_TOP);
        addAlert((err as Error).message);
      }
    },
    [
      type,
      orientation,
      touchLocation,
      functions.getIntersectingTileId,
      functions.placeShip,
    ]
  );

  const handleDragStartEvent = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragEmitter.current.emit("dragstart", event);
  }, []);

  const handleDragEndEvent = useCallback((event: MouseEvent | TouchEvent) => {
    dragEmitter.current.emit("dragend", event);
  }, []);

  const handleDragStart = useCallback(() => {
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("mousemove", handleDrag);

    document.addEventListener("touchstart", handleRotate);
    document.addEventListener("keydown", handleRotate);

    document.addEventListener("mouseup", handleDragEndEvent);
    document.addEventListener("touchend", handleDragEndEvent);
    document.addEventListener("touchcancel", handleDragEndEvent);

    const removeEventListenersCallback = () => {
      dragEmitter.current.off("dragend", removeEventListenersCallback);

      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("mousemove", handleDrag);

      document.removeEventListener("touchstart", handleRotate);
      document.removeEventListener("keydown", handleRotate);

      document.removeEventListener("touchend", handleDragEndEvent);
      document.removeEventListener("mouseup", handleDragEndEvent);
      document.removeEventListener("touchcancel", handleDragEndEvent);
    };

    dragEmitter.current.on("dragend", removeEventListenersCallback);
  }, [handleDrag, handleRotate, handleDragEndEvent]);

  // Create drag handlers when ship is initially clicked (drag start)
  useEffect(() => {
    if (!isTray || !shipRef.current) {
      return;
    }

    shipRef.current.addEventListener("touchstart", handleDragStartEvent);
    shipRef.current.addEventListener("mousedown", handleDragStartEvent);

    return () => {
      if (shipRef.current) {
        shipRef.current.removeEventListener("touchstart", handleDragStartEvent);
        shipRef.current.removeEventListener("mousedown", handleDragStartEvent);
      }
    };
  }, [shipRef.current, isTray, handleDragStartEvent]);

  // React to dragstart event
  useEffect(() => {
    if (!isTray || !shipRef.current) {
      return;
    }

    dragEmitter.current.on("dragstart", handleDragStart);

    return () => {
      dragEmitter.current.off("dragstart", handleDragStart);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("mousemove", handleDrag);

      document.removeEventListener("touchstart", handleRotate);
      document.removeEventListener("keydown", handleRotate);

      document.removeEventListener("touchend", handleDragEndEvent);
      document.removeEventListener("mouseup", handleDragEndEvent);
      document.addEventListener("touchcancel", handleDragEndEvent);
    };
  }, [isTray, shipRef.current, handleDragStart]);

  // React to dragend event
  useEffect(() => {
    if (!isTray || !tileBounds) {
      return;
    }

    dragEmitter.current.on("dragend", handleDragEnd);

    return () => {
      dragEmitter.current.off("dragend", handleDragEnd);
    };
  }, [isTray, tileBounds, handleDragEnd]);

  return (
    <div
      className={classNames.join(" ")}
      ref={shipRef}
      style={{
        ...(location ?? { top: 0, right: 0 }),
      }}
    >
      {children}
    </div>
  );
};
