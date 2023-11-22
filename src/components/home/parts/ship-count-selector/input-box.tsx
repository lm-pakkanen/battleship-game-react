import "./input-box.css";

export interface InputBox {
  num: number;
  isSelected: boolean;
  handleClick: (num: number) => void;
}

export const InputBox = ({ num, isSelected, handleClick }: InputBox) => {
  const classNames = ["ship-count-selector-input-box"];

  if (isSelected) {
    classNames.push("input-box-selected");
  }

  return (
    <button className={classNames.join(" ")} onClick={() => handleClick(num)}>
      {num}
    </button>
  );
};
