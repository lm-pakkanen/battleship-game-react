import "./button.css";
import "./instructions-modal-button.css";

export interface InstructionsModalButton {
  setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InstructionsModalButton = ({
  setIsDialogVisible,
}: InstructionsModalButton) => {
  return (
    <button
      className="button instructions-modal-button"
      onClick={() => setIsDialogVisible(true)}
    >
      ?
    </button>
  );
};
