import React, { useState } from "react";
import { InstructionsModal } from "./instructions-modal";
import { InstructionsModalButton } from "./controls/instructions-modal-button";
import "./menu-bar.css";

export interface MenuBar {
  children: React.ReactNode;
  helpText?: string;
}

export const MenuBar = ({ children, helpText }: MenuBar) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  return (
    <>
      <InstructionsModal
        isVisible={isDialogVisible}
        setIsVisible={setIsDialogVisible}
      />
      <div className="menu-bar">
        {children}
        {helpText && (
          <InstructionsModalButton setIsDialogVisible={setIsDialogVisible} />
        )}
      </div>
    </>
  );
};
