import { ShipType } from "../../../../enums/ShipType";
import { InputBox } from "./input-box";
import "./index.css";

export interface ShipCountSelector {
  shipType: ShipType;
  maxCount: number;
  selectedCount: number;
  setSelectedCount: (num: number) => void;
}

export const ShipCountSelector = ({
  shipType,
  maxCount,
  selectedCount,
  setSelectedCount,
}: ShipCountSelector) => {
  const handleInputBoxClick: InputBox["handleClick"] = (num) => {
    setSelectedCount(num);
  };

  return (
    <section
      className="ship-count-selector"
      onClick={(event) => {
        // Prevents bug where clicking section focuses first input
        event.preventDefault();
      }}
    >
      {[...Array(maxCount).keys()]
        .map((n) => n + 1)
        .map((n) => (
          <InputBox
            key={`${shipType}-selector-${n}`}
            num={n}
            isSelected={selectedCount === n}
            handleClick={handleInputBoxClick}
          />
        ))}
    </section>
  );
};
