import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProntuarioPublico from "./pages/ProntuarioPublico";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { authService } from "./services/authServices"; // ajuste se for default export

const App: React.FC = () => {
  const isAuth = authService.isAuthenticated();

  return (
    <>
      <Routes>
        {/* Redirect raiz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota pública de login */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Rota pública para pacientes */}
        <Route
          path="/prontuario/acesso/:linkId"
          element={<ProntuarioPublico />}
        />

        {/* Rotas protegidas com layout (coloque por último) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", height: "100vh" }}>
                <Sidebar />
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Header />
                  <main style={{ flex: 1, overflow: "auto", padding: "20px" }}>
                    <AppRoutes />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
