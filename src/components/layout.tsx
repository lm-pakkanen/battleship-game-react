import { MenuBar } from "./menu-bar";
import "./layout.css";

export interface Layout {
  children: React.ReactNode;
  menuBarContent?: React.ReactNode;
  helpText?: string;
}

export const Layout = ({ children, menuBarContent, helpText }: Layout) => {
  return (
    <div className="layout">
      <MenuBar helpText={helpText}>{menuBarContent}</MenuBar>
      <div className="layout-content" id="layout-content">
        {children}
      </div>
    </div>
  );
};
