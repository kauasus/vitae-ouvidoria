import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { Manifestation } from "../types/manifestation";
import { Card } from "primereact/card";

const DetailsManifestation: React.FC = () => {
  const { id } = useParams();
  const [m, setM] = useState<Manifestation | undefined>();

  useEffect(() => {
    if (id) setM(ouvidoriaService.listar().find((x) => String(x.id) === id));
  }, [id]);

  if (!m) return <div>Manifestação não encontrada</div>;

  return (
    <Card title={`${m.tipo} — ${new Date(m.dataRegistro).toLocaleString()}`}>
      <p>{m.descricao}</p>
      <h4>Solicitante</h4>
      <div>{m.solicitante.nome}</div>
      <h4>Paciente</h4>
      <div>{m.paciente.nome}</div>
    </Card>
  );
};

export default DetailsManifestation;