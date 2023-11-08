import { useDrop } from "react-dnd";
import "./tile.css";

export interface Tile {
  coordinate: string;
  isGuessed: boolean;
  handleClick: (coordinate: string) => void;
}

export const Tile = ({
  coordinate,
  isGuessed,
  handleClick: _handleClick,
}: Tile) => {
  const [, drop] = useDrop(() => ({
    accept: "ship",
    drop: () => ({ coordinate }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    _handleClick(coordinate);
  };

  return (
    <div className="tile" onClick={handleClick} ref={drop}>
      {isGuessed ? "X" : coordinate}
    </div>
  );
};
