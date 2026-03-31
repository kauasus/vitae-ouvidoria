import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";




import { authService } from "./services/authServices";
import { setOnUnauthorized } from "./api/api";

// Inicializa header do axios com token salvo e registra handler global de 401
authService.init();
setOnUnauthorized(() => {
  authService.logout();
  // redireciona para login (pode ajustar)
  window.location.href = "/login";
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);