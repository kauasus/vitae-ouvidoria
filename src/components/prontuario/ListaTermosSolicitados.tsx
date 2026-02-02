import React, { useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { prontuarioService } from "../../services/prontuarioServices";
import type { SolicitacaoProntuario } from "../../types/prontuarios";

const ListaTermosSolicitados: React.FC = () => {
  const [solicitacoes] = useState<SolicitacaoProntuario[]>(prontuarioService.getSolicitacoes());
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoProntuario | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const verDetalhes = (solicitacao: SolicitacaoProntuario) => {
    setSelectedSolicitacao(solicitacao);
    setShowDialog(true);
  };

  const acoesTemplate = (rowData: SolicitacaoProntuario) => {
    return (
      <Button
        label="Ver Detalhes"
        icon="pi pi-eye"
        className="p-button-sm p-button-info"
        onClick={() => verDetalhes(rowData)}
      />
    );
  };

  return (
    <div>
      <Card title="Termos de Responsabilidade Solicitados">
        <DataTable
          value={solicitacoes}
          paginator
          rows={10}
          emptyMessage="Nenhuma solicitação registrada ainda"
        >
          <Column field="nome" header="Nome do Paciente" sortable />
          <Column field="cpf" header="CPF" sortable />
          <Column field="email" header="E-mail" sortable />
          <Column
            field="dataHoraSolicitacao"
            header="Data/Hora"
            body={(row) => new Date(row.dataHoraSolicitacao).toLocaleString("pt-BR")}
            sortable
          />
          <Column
            field="aceitouTermo"
            header="Termo Aceito"
            body={(row) => (row.aceitouTermo ? "✓ Sim" : "✗ Não")}
          />
          <Column header="Ações" body={acoesTemplate} />
        </DataTable>
      </Card>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Detalhes da Solicitação"
        style={{ width: "600px" }}
      >
        {selectedSolicitacao && (
          <div className="p-3">
            <div className="field mb-3">
              <label className="font-bold">Nome:</label>
              <p>{selectedSolicitacao.nome}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">CPF:</label>
              <p>{selectedSolicitacao.cpf}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">Data de Nascimento:</label>
              <p>{new Date(selectedSolicitacao.dataNascimento).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">Telefone:</label>
              <p>{selectedSolicitacao.telefone}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">E-mail:</label>
              <p>{selectedSolicitacao.email}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">Motivo:</label>
              <p>{selectedSolicitacao.motivo}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">Data/Hora da Solicitação:</label>
              <p>{new Date(selectedSolicitacao.dataHoraSolicitacao).toLocaleString("pt-BR")}</p>
            </div>
            <div className="field mb-3">
              <label className="font-bold">Termo Aceito:</label>
              <p>{selectedSolicitacao.aceitouTermo ? "✓ Sim" : "✗ Não"}</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export { ListaTermosSolicitados };