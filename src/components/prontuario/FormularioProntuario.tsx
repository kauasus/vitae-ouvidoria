import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import type { SolicitacaoProntuario } from "../../types/prontuarios";
import TermoDialog from "./TermoDialog";
import { prontuarioService } from "../../services/prontuarioServices";

type Props = {
  linkId: string;
  onSucesso: () => void;
};

const FormularioProntuario: React.FC<Props> = ({ linkId, onSucesso }) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [showTermo, setShowTermo] = useState(false);
  const [aceitouTermo, setAceitouTermo] = useState(false);

  const abrirTermo = () => {
    if (!nome || !cpf || !dataNascimento || !telefone || !email || !motivo) {
      alert("Por favor, preencha todos os campos antes de solicitar.");
      return;
    }
    setShowTermo(true);
  };

  const confirmarSolicitacao = () => {
    const solicitacao: SolicitacaoProntuario = {
      id: `SOL-${Date.now()}`,
      linkId,
      nome,
      cpf,
      dataNascimento: dataNascimento!.toISOString(),
      telefone,
      email,
      motivo,
      aceitouTermo,
      dataHoraSolicitacao: new Date().toISOString(),
    };

    prontuarioService.salvarSolicitacao(solicitacao);
    setShowTermo(false);
    onSucesso();
  };

  return (
    <div>
      <Card title="Solicitação de Retirada de Prontuário Médico" className="shadow-3">
        <div className="p-fluid grid">
          <div className="col-12 md:col-8 field">
            <label className="font-bold block mb-2">Nome Completo *</label>
            <InputText value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome completo" />
          </div>

          <div className="col-12 md:col-4 field">
            <label className="font-bold block mb-2">CPF *</label>
            <InputText value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
          </div>

          <div className="col-12 md:col-4 field">
            <label className="font-bold block mb-2">Data de Nascimento *</label>
            <Calendar
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.value as Date)}
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/aaaa"
              showIcon
            />
          </div>

          <div className="col-12 md:col-4 field">
            <label className="font-bold block mb-2">Telefone *</label>
            <InputText value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
          </div>

          <div className="col-12 md:col-4 field">
            <label className="font-bold block mb-2">E-mail *</label>
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" />
          </div>

          <div className="col-12 field">
            <label className="font-bold block mb-2">Motivo da Retirada/Transferência *</label>
            <InputTextarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              placeholder="Descreva o motivo da solicitação..."
            />
          </div>

          <div className="col-12 flex justify-content-end">
            <Button
              label="Solicitar Retirada"
              icon="pi pi-send"
              className="p-button-raised p-button-registrar"
              onClick={abrirTermo}
            />
          </div>
        </div>
      </Card>

      <TermoDialog
        visible={showTermo}
        onHide={() => setShowTermo(false)}
        nome={nome}
        cpf={cpf}
        dataNascimento={dataNascimento?.toISOString() || ""}
        aceitou={aceitouTermo}
        onChangeAceite={setAceitouTermo}
        onConfirmar={confirmarSolicitacao}
      />
    </div>
  );
};

export default FormularioProntuario;