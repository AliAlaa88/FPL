import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LeaguesProvider } from "./context/leaguesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LeaguesProvider>
      <App />
    </LeaguesProvider>
  </StrictMode>
);
