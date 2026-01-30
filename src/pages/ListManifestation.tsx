import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { Manifestation } from "../types/manifestation";

const ListManifestations: React.FC = () => {
  const [list, setList] = useState<Manifestation[]>([]);

  useEffect(() => {
    setList(ouvidoriaService.listar());
  }, []);

  return (
    <div>
      <h2>Manifestações</h2>
      <DataTable value={list} dataKey="id" paginator rows={10}>
        <Column field="tipo" header="Tipo" />
        <Column field="canalOrigem" header="Canal" />
        <Column field="solicitante.nome" header="Solicitante" />
        <Column field="paciente.nome" header="Paciente" />
        <Column field="dataRegistro" header="Data" body={(r) => new Date(r.dataRegistro).toLocaleString()} />
        <Column
          header="Ações"
          body={(row: Manifestation) => (
            <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-button-text" onClick={() => (window.location.href = `/manifestations/${row.id}`)} />
          )}
        />
      </DataTable>
    </div>
  );
};

export default ListManifestations;