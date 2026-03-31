/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManifestationForm from "../components/ouvidoria/ManifestationForm";
import { authService } from "../services/authServices";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { CreateManifestationDTO } from "../types/createManifestation.dto";

type Notification = { type: "success" | "error"; title?: string; message: string } | null;

const NewManifestation: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const navigate = useNavigate();

  const showNotification = (n: Notification) => {
    setNotification(n);
    // auto-dismiss after 3.5s
    setTimeout(() => setNotification(null), 3500);
  };

  const onSave = async (dtoWithoutUser: Omit<CreateManifestationDTO, "usuarioId">) => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user?.id) throw new Error("Usuário não autenticado");

      const dto: CreateManifestationDTO = { ...dtoWithoutUser, usuarioId: user.id };
      await ouvidoriaService.createManifestation(dto);

      showNotification({ type: "success", title: "Sucesso", message: "Manifestação registrada" });
      setVisible(false);
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao registrar manifestação";
      showNotification({ type: "error", title: "Erro", message: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Simple notification bar */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-50 max-w-sm w-full shadow-lg rounded-md p-4 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              )}
            </div>
            <div className="flex-1 text-sm">
              {notification.title && <div className="font-semibold">{notification.title}</div>}
              <div>{notification.message}</div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <ManifestationForm
        visible={visible}
        onHide={() => navigate("/dashboard")}
        onSave={onSave}
        loading={loading}
      />
    </>
  );
};

export default NewManifestation;