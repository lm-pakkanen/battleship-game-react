import "./input-label.css";
import "./ship-count-label.css";

export interface ShipCountLabel {
  label: string;
  count: number;
}

export const ShipCountLabel = ({ label, count }: ShipCountLabel) => {
  return (
    <>
      <span className="input-label">{label}</span>
      <span className="input-label-count">{`L = ${count}`}</span>
    </>
  );
};
