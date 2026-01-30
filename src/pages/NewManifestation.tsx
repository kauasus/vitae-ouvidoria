import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import ManifestationForm from "../components/ouvidoria/ManifestationForm";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { Manifestation } from "../types/manifestation";

const NewManifestation: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(true);

  const onSave = (m: Manifestation) => {
    ouvidoriaService.salvar(m);
    toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Manifestação registrada" });
    setVisible(false);
    setTimeout(() => (window.location.href = "/dashboard"), 700);
  };

  return (
    <>
      <Toast ref={toast} />
      <ManifestationForm visible={visible} onHide={() => (window.location.href = "/dashboard")} onSave={onSave} />
    </>
  );
};

export default NewManifestation;