import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Dialog } from "./modal";
import "./menu-bar.css";

export interface MenuBar {
  children: React.ReactNode;
  helpText?: string;
}

export const MenuBar = ({ children, helpText }: MenuBar) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const DialogComponent = useMemo(() => {
    return helpText
      ? ReactDOM.createPortal(
          <Dialog
            isVisible={isDialogVisible}
            setIsVisible={setIsDialogVisible}
          />,
          document.body
        )
      : null;
  }, [helpText, isDialogVisible]);

  return (
    <>
      {DialogComponent}
      <div className="menu-bar">
        {children}
        {helpText && (
          <button onClick={() => setIsDialogVisible(true)}>?</button>
        )}
      </div>
    </>
  );
};
