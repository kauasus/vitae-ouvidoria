import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { prontuarioService } from "../../services/prontuarioServices";
import type { LinkTemporario } from "../../types/prontuarios";

const GerarLinkTemporario: React.FC = () => {
  const [links, setLinks] = useState<LinkTemporario[]>(prontuarioService.getLinks());
  const [horasValidade, setHorasValidade] = useState<number>(24);
  const [linkGerado, setLinkGerado] = useState<LinkTemporario | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const gerarNovoLink = () => {
    const novoLink = prontuarioService.gerarLinkTemporario(horasValidade);
    setLinks(prontuarioService.getLinks());
    setLinkGerado(novoLink);
    setShowDialog(true);
  };

  const desativar = (linkId: string) => {
    prontuarioService.desativarLink(linkId);
    setLinks(prontuarioService.getLinks());
  };

  const copiarLink = () => {
    const url = `${window.location.origin}/prontuario/acesso/${linkGerado?.id}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
  };

  const statusTemplate = (rowData: LinkTemporario) => {
    if (rowData.usado) return <span>✓ Usado</span>;
    if (!rowData.ativo) return <span>✗ Desativado</span>;
    if (new Date(rowData.dataExpiracao) < new Date()) return <span>⏱ Expirado</span>;
    return <span>● Ativo</span>;
  };

  const acoesTemplate = (rowData: LinkTemporario) => {
    if (rowData.ativo && !rowData.usado && new Date(rowData.dataExpiracao) > new Date()) {
      return (
        <Button
          label="Desativar"
          icon="pi pi-ban"
          className="p-button-sm p-button-danger"
          onClick={() => desativar(rowData.id)}
        />
      );
    }
    return null;
  };

  return (
    <div>
      <Card title="Gerar Link Temporário para Prontuário" className="mb-4">
        <div className="flex align-items-end gap-3">
          <div className="field">
            <label className="font-bold block mb-2">Validade (horas)</label>
            <InputNumber
              value={horasValidade}
              onValueChange={(e) => setHorasValidade(e.value || 24)}
              min={1}
              max={168}
              showButtons
            />
          </div>
          <Button
            label="Gerar Novo Link"
            icon="pi pi-link"
            className="p-button-raised"
            onClick={gerarNovoLink}
          />
        </div>
      </Card>

      <Card title="Links Gerados">
        <DataTable value={links} paginator rows={10} emptyMessage="Nenhum link gerado ainda">
          <Column field="login" header="Login" sortable />
          <Column field="senha" header="Senha" sortable />
          <Column
            field="dataCriacao"
            header="Criado em"
            body={(rowData: LinkTemporario) =>
              new Date(rowData.dataCriacao).toLocaleString("pt-BR")
            }
            sortable
          />
          <Column
            field="dataExpiracao"
            header="Expira em"
            body={(rowData: LinkTemporario) =>
              new Date(rowData.dataExpiracao).toLocaleString("pt-BR")
            }
            sortable
          />
          <Column header="Status" body={statusTemplate} />
          <Column header="Ações" body={acoesTemplate} />
        </DataTable>
      </Card>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Link Gerado com Sucesso!"
        style={{ width: "500px" }}
      >
        <div className="p-3">
          <p className="mb-3">
            <strong>Envie estas credenciais para o paciente:</strong>
          </p>

          <div className="field">
            <label className="font-bold">Login:</label>
            <InputText value={linkGerado?.login || ""} readOnly className="w-full mt-2" />
          </div>

          <div className="field">
            <label className="font-bold">Senha:</label>
            <InputText value={linkGerado?.senha || ""} readOnly className="w-full mt-2" />
          </div>

          <div className="field">
            <label className="font-bold">Link de Acesso:</label>
            <InputText
              value={`${window.location.origin}/prontuario/acesso/${linkGerado?.id ?? ""}`}
              readOnly
              className="w-full mt-2"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export { GerarLinkTemporario };