import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
// Adicione as chaves aqui:
import { GerarLinkTemporario } from "../components/prontuario/GerarLinkTemporario";
import { ListaTermosSolicitados } from "../components/prontuario/ListaTermosSolicitados";

const ProntuarioAdmin: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="dashboard-title-black mb-4">Gestão de Prontuários</h1>
      <TabView>
        <TabPanel header="Gerar Links Temporários" leftIcon="pi pi-link mr-2">
          <GerarLinkTemporario />
        </TabPanel>
        <TabPanel header="Termos Solicitados" leftIcon="pi pi-file-check mr-2">
          <ListaTermosSolicitados />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ProntuarioAdmin;