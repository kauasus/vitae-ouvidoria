import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewManifestation from "../pages/NewManifestation";
import ListManifestations from "../pages/ListManifestation";
import DetailsManifestation from "../pages/DetailsManifestation";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/manifestations/new" element={<NewManifestation />} />
    <Route path="/manifestations" element={<ListManifestations />} />
    <Route path="/manifestations/:id" element={<DetailsManifestation />} />
  </Routes>
);

export default AppRoutes;