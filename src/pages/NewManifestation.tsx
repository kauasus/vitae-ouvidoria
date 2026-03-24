/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/NewManifestation.tsx
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import ManifestationForm from "../components/ouvidoria/ManifestationForm";
import { ouvidoriaService } from "../services/OuvidoriaService";
import { authService } from "../services/authServices";
import type { Manifestation } from "../types/manifestation";
import type { CreateManifestationDTO } from "../types/createManifestation.dto";

const NewManifestation: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSave = async (m: Manifestation) => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) throw new Error("Usuário não autenticado");

      const payload: CreateManifestationDTO = {
        tipoId: typeof m.tipo === "object" ? (m.tipo as any).id : Number(m.tipo),
        canalId: typeof m.canalOrigem === "object" ? (m.canalOrigem as any).id : Number(m.canalOrigem),
        descricao: m.descricao,
        solicitante: {
          nome: m.solicitante.nome,
          cpf: m.solicitante.cpf ?? undefined,
        },
        paciente: m.paciente ? { nome: m.paciente.nome, cpf: m.paciente.cpf ?? undefined } : null,
        usuarioId: user.id,
      };

      await ouvidoriaService.createManifestation(payload);
      toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Manifestação registrada" });
      setVisible(false);
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao salvar manifestação";
      toast.current?.show({ severity: "error", summary: "Erro", detail: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ManifestationForm
        visible={visible}
        onHide={() => navigate("/dashboard")}
        onSave={onSave}
        loading={loading} // agora existe essa prop no form (ver passo 4)
      />
    </>
  );
};

export default NewManifestation;