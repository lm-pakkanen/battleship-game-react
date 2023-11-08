import { useDrag } from "react-dnd";
import { ShipType } from "../../../enums/ShipType";
import { ShipOrientation } from "../../../enums/ShipOrientation";
import { useGameContext } from "../../../hooks/useGameContex";
import { addAlert } from "../../../functions/add-alert";
import "./draggable.css";

export interface Draggable {
  shipType: ShipType;
}

export const Draggable = ({ shipType }: Draggable) => {
  const { functions } = useGameContext();

  const [, drag] = useDrag(
    () => ({
      type: "ship",
      item: { shipType },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<{ coordinate: string }>();

        if (item && dropResult) {
          try {
            functions.placeShip(
              dropResult.coordinate,
              item.shipType,
              ShipOrientation.RIGHT_TO_LEFT
            );
          } catch (err) {
            addAlert(err);
          }
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [functions.placeShip]
  );

  return (
    <div className="draggable-wrapper">
      <div className="draggable" ref={drag}>
        TEST TILE
      </div>
    </div>
  );
};
