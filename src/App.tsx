import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProntuarioPublico from "./pages/ProntuarioPublico";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { authService } from "./services/authServices";

const App: React.FC = () => {
  return (
    
      <Routes>
        {/* Rota pública de login */}
        <Route
          path="/login"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Rota pública para pacientes */}
        <Route path="/prontuario/acesso/:linkId" element={<ProntuarioPublico />} />

        {/* Rotas protegidas com layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", height: "100vh" }}>
                <Sidebar />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Header />
                  <main style={{ flex: 1, overflow: "auto", padding: "20px" }}>
                    <AppRoutes />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect raiz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    
  );
};

export default App;