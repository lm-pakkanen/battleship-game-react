import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Home } from "./pages/home";
import { Game } from "./pages/game";
import "./global.css";
import { addAlert } from "./functions/add-alert";

addAlert.createQueue();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="background">
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/game" Component={Game} />
        </Routes>
      </Router>
    </div>
  </React.StrictMode>
);
