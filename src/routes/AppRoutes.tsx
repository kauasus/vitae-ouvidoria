import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewManifestation from "../pages/NewManifestation";
import ListManifestations from "../pages/ListManifestation";
import DetailsManifestation from "../pages/DetailsManifestation";
import ProntuarioAdmin from "../pages/ProntuarioAdmin";
import ProtectedRoute from "../components/layout/ProtectedRoute";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/manifestations/new" element={<NewManifestation />} />
    <Route path="/manifestations" element={<ListManifestations />} />
    <Route path="/manifestations/:id" element={<DetailsManifestation />} />
    
    {/* Rota protegida apenas para admin */}
    <Route
      path="/prontuario/admin"
      element={
        <ProtectedRoute requireAdmin>
          <ProntuarioAdmin />
        </ProtectedRoute>
      }
    />
    
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;