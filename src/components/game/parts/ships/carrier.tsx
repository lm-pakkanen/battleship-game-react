import type { Ship } from "./ship";
import "./carrier.css";

export const Carrier = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames = ["carrier-wrapper"];

  if (destroyed) {
    classNames.push("carrier-destroyed");
  }

  return (
    <div className={classNames.join(" ")}>
      <img src="./img/carrier.png" height={370} width={180} draggable={false} />
    </div>
  );
};
