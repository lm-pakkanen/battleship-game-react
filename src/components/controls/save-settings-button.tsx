export interface SaveSettingsButton {
  handleSaveSettings: () => void;
}

export const SaveSettingsButton = ({
  handleSaveSettings,
}: SaveSettingsButton) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      handleSaveSettings();
    }
  };

  return (
    <button
      className="button"
      onClick={handleSaveSettings}
      onKeyDown={handleKeyDown}
    >
      Save settings & start game
    </button>
  );
};
