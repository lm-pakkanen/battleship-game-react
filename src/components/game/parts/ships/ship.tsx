import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

interface ClientLocation {
  clientY: number;
  clientX: number;
}

export interface ShipLocation {
  bottom: number;
  left: number;
}

export interface Ship {
  type: ShipType;
  destroyed: boolean;
  isTray: boolean;
  initialOrientation: ShipOrientation;
  tabIndex: number;
  count?: number;
}

export const Ship = ({
  type,
  destroyed,
  isTray,
  initialOrientation,
  tabIndex,
  count,
}: Ship) => {
  const { functions, tileBounds } = useGameContext();

  const [orientation, setOrientation] =
    useState<ShipOrientation>(initialOrientation);

  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState<ShipLocation>({
    bottom: 0,
    left: 0,
  });

  const [clientLocation, setClientLocation] = useState<null | ClientLocation>(
    null
  );

  const dragEmitter = useRef(new EventEmitter());
  const shipRef = useRef<HTMLDivElement>(null);

  const isDraggable = useMemo(
    () => !(isTray && count !== undefined),
    [isTray, count]
  );

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

    if (isTray && count !== undefined) {
      nextClassNames.push("non-draggable");
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
  }, [isTray, isDragging, type, orientation, count]);

  const handleKeydown: KeyboardEventHandler = useCallback(
    (event) => {
      if (!shipRef.current) {
        return;
      }

      if (["Escape", "Enter", "Tab"].includes(event.key)) {
        dragEmitter.current.emit("dragend");
        return;
      }

      setIsDragging(true);

      if (event.key === "r") {
        handleRotate(event as unknown as KeyboardEvent);
        return;
      }

      event.preventDefault();
      const moveUnit = 70;

      const shipRect = shipRef.current.getBoundingClientRect();

      const getNextClientState = (
        oldState: null | ClientLocation
      ): ClientLocation => {
        if (oldState) {
          return oldState;
        }

        const tileSize = 70;

        const shipTop = shipRect.top;
        const shipHeight = shipRect.height;

        const shipLeft = shipRect.left;
        const shipWidth = shipRect.width;

        const dragCenterY = shipTop + shipHeight - tileSize / 2;
        const dragCenterX = shipLeft + shipWidth - tileSize / 2;

        return {
          clientY: dragCenterY,
          clientX: dragCenterX,
        };
      };

      switch (event.key) {
        case "ArrowUp": {
          setLocation((oldState) => ({
            ...oldState,
            bottom: oldState.bottom + moveUnit,
          }));

          setClientLocation((oldState) => {
            const nextState = getNextClientState(oldState);

            return {
              ...nextState,
              clientY: nextState.clientY - moveUnit,
            };
          });

          break;
        }

        case "ArrowRight": {
          setLocation((oldState) => ({
            ...oldState,
            left: oldState.left + moveUnit,
          }));

          setClientLocation((oldState) => {
            const nextState = getNextClientState(oldState);

            return {
              ...nextState,
              clientX: nextState.clientX + moveUnit,
            };
          });

          break;
        }

        case "ArrowDown": {
          setLocation((oldState) => ({
            ...oldState,
            bottom: oldState.bottom - moveUnit,
          }));

          setClientLocation((oldState) => {
            const nextState = getNextClientState(oldState);

            return {
              ...nextState,
              clientY: nextState.clientY + moveUnit,
            };
          });

          break;
        }

        case "ArrowLeft": {
          setLocation((oldState) => ({
            ...oldState,
            left: oldState.left - moveUnit,
          }));

          setClientLocation((oldState) => {
            const nextState = getNextClientState(oldState);

            return {
              ...nextState,
              clientX: nextState.clientX - moveUnit,
            };
          });

          break;
        }

        default: {
          return;
        }
      }
    },
    [shipRef.current, dragEmitter.current]
  );

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
      } else if (event instanceof MouseEvent) {
        clientY = event.clientY;
        clientX = event.clientX;
      }

      setClientLocation({ clientY, clientX });

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

  const handleDragEnd = useCallback(() => {
    if (!clientLocation) {
      return;
    }

    setIsDragging(false);

    const { scrollOffsetTop, scrollOffsetLeft } = getLayoutScrollOffset();
    const { clientY, clientX } = clientLocation;

    const location: ShipLocation = {
      bottom: clientY + scrollOffsetTop,
      left: clientX + scrollOffsetLeft,
    };

    const intersectingTile = functions.getIntersectingTileId(location);

    try {
      const success = functions.placeShip(intersectingTile, type, orientation);

      console.log(clientY, clientX);

      if (!success) {
        setLocation({ bottom: 0, left: 0 });
        setClientLocation(null);
        setOrientation(ShipOrientation.BOTTOM_TO_TOP);
      }
    } catch (err) {
      setLocation({ bottom: 0, left: 0 });
      setClientLocation(null);
      setOrientation(ShipOrientation.BOTTOM_TO_TOP);
      addAlert((err as Error).message);
    }
  }, [
    type,
    orientation,
    clientLocation,
    functions.getIntersectingTileId,
    functions.placeShip,
  ]);

  console.log(orientation);

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
    if (!isDraggable || !shipRef.current) {
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
  }, [shipRef.current, isDraggable, handleDragStartEvent]);

  // React to dragstart event
  useEffect(() => {
    if (!isDraggable || !shipRef.current) {
      return;
    }

    dragEmitter.current.on("dragstart", handleDragStart);

    return () => {
      dragEmitter.current.off("dragstart", handleDragStart);
    };
  }, [isDraggable, shipRef.current, handleDragStart]);

  // React to dragend event
  useEffect(() => {
    if (!isDraggable || !tileBounds) {
      return;
    }

    dragEmitter.current.on("dragend", handleDragEnd);

    return () => {
      dragEmitter.current.off("dragend", handleDragEnd);
    };
  }, [isDraggable, tileBounds, handleDragEnd]);

  return (
    <>
      <div
        className={classNames.join(" ")}
        style={{
          ...(location ?? { top: 0, right: 0 }),
        }}
        tabIndex={tabIndex}
        ref={shipRef}
        onKeyDown={handleKeydown}
      >
        {children}
      </div>
      {count !== undefined && (
        <div className={`ship-count ${count === 0 ? "ship-count-zero" : ""}`}>
          {count}
        </div>
      )}
    </>
  );
};
