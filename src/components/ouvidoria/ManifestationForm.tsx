import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import type { Manifestation, Person, Tipo, Canal, Status } from "../../types/manifestation";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSave: (m: Manifestation) => void;
  initial?: Partial<Manifestation>;
};

const tipos: { label: string; value: Tipo }[] = [
  { label: "Elogio", value: "ELOGIO" },
  { label: "Reclamação", value: "RECLAMACAO" },
];

const canais: { label: string; value: Canal }[] = [
  { label: "WhatsApp", value: "WHATSAPP" },
  { label: "Reclame Aqui", value: "RECLAME_AQUI" },
  { label: "Google", value: "GOOGLE" },
  { label: "E-mail", value: "EMAIL" },
];

const statusOptions: { label: string; value: Status }[] = [
  { label: "Pendente", value: "PENDENTE" },
  { label: "Em Andamento", value: "EM_ANDAMENTO" },
  { label: "Resolvido", value: "RESOLVIDO" },
];

const tipoOptionTemplate = (option: { label: string; value: Tipo } | undefined) => {
  if (!option) return null;
  const iconClass =
    option.value === "ELOGIO" ? "pi-heart-fill text-vitae-green" : "pi-exclamation-triangle text-vitae-red";
  return (
    <div className="flex align-items-center">
      <i className={`pi ${iconClass} mr-2`} />
      <span>{option.label}</span>
    </div>
  );
};

const canalOptionTemplate = (option: { label: string; value: Canal } | undefined) => {
  if (!option) return null;
  const icons: Record<Canal, string> = {
    WHATSAPP: "pi-whatsapp",
    RECLAME_AQUI: "pi-megaphone",
    GOOGLE: "pi-google",
    EMAIL: "pi-envelope",
  };
  return (
    <div className="flex align-items-center">
      <i className={`pi ${icons[option.value]} mr-2 text-vitae-blue`} />
      <span>{option.label}</span>
    </div>
  );
};

const ManifestationForm: React.FC<Props> = ({ visible, onHide, onSave, initial }) => {
  const emptyPerson = (): Person => ({ nome: "", cpf: "", telefone: "", email: "" });

  const [manifestation, setManifestation] = useState<Manifestation>({
    id: Date.now(),
    tipo: "ELOGIO",
    canalOrigem: "WHATSAPP",
    descricao: "",
    solicitante: emptyPerson(),
    paciente: emptyPerson(),
    solicitanteEhPaciente: false,
    status: "PENDENTE",
    dataRegistro: new Date().toISOString(),
  });

  useEffect(() => {
    if (initial) setManifestation((prev) => ({ ...prev, ...initial }));
  }, [initial, visible]);

  const onChangeSolicitante = (field: keyof Person, value: any) => {
    setManifestation((prev) => {
      const solicitante = { ...prev.solicitante, [field]: value };
      return {
        ...prev,
        solicitante,
        paciente: prev.solicitanteEhPaciente ? { ...solicitante } : prev.paciente,
      };
    });
  };

  const onChangePaciente = (field: keyof Person, value: any) => {
    setManifestation((prev) => ({ ...prev, paciente: { ...prev.paciente, [field]: value } }));
  };

  const toggleSolicitanteEhPaciente = (checked: boolean) => {
    setManifestation((prev) => ({
      ...prev,
      solicitanteEhPaciente: checked,
      paciente: checked ? { ...prev.solicitante } : prev.paciente,
    }));
  };

  const handleSave = () => {
    if (!manifestation.descricao?.trim()) {
      alert("Descrição é obrigatória.");
      return;
    }
    if (!manifestation.solicitante?.nome?.trim()) {
      alert("Nome do solicitante é obrigatório.");
      return;
    }
    onSave(manifestation);
  };

  const footer = (
    <div className="flex justify-content-end gap-2 pt-3">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-raised p-button-cancelar"
        onClick={onHide}
      />
      <Button
        label="Registrar Manifestação"
        icon="pi pi-check"
        className="p-button-raised p-button-registrar"
        onClick={handleSave}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex align-items-center gap-2">
          <i className="pi pi-file-edit text-vitae-red" style={{ fontSize: "1.25rem" }} />
          <span>Nova Manifestação</span>
        </div>
      }
      modal
      style={{ width: "70vw", maxWidth: 920 }}
      breakpoints={{ "960px": "85vw", "640px": "95vw" }}
      footer={footer}
      className="custom-dialog"
    >
      <div className="p-fluid grid">
        {/* Tipo e Canal */}
        <div className="col-12 md:col-6 field">
          <div className="label-with-icon">
            <i className="pi pi-tag text-vitae-red" />
            <span>Tipo de Manifestação</span>
          </div>
          <Dropdown
            value={manifestation.tipo}
            options={tipos}
            itemTemplate={tipoOptionTemplate}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => setManifestation({ ...manifestation, tipo: e.value })}
            placeholder="Selecione o tipo"
          />
        </div>

        <div className="col-12 md:col-6 field">
          <div className="label-with-icon">
            <i className="pi pi-share-alt text-vitae-gray-text" />
            <span>Canal de Origem</span>
          </div>
          <Dropdown
            value={manifestation.canalOrigem}
            options={canais}
            itemTemplate={canalOptionTemplate}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => setManifestation({ ...manifestation, canalOrigem: e.value })}
            placeholder="Selecione o canal"
          />
        </div>

        <div className="col-12 field">
          <div className="label-with-icon">
            <i className="pi pi-align-left text-vitae-gray-text" />
            <span>Descrição Detalhada</span>
          </div>
          <InputTextarea
            value={manifestation.descricao}
            onChange={(e) => setManifestation({ ...manifestation, descricao: e.target.value })}
            rows={5}
            autoResize
            placeholder="Descreva o ocorrido com o máximo de detalhes..."
          />
        </div>

        <Divider align="left">
          <div className="inline-flex align-items-center">
            <i className="pi pi-user text-vitae-red mr-2" />
            <b>Dados do Solicitante</b>
          </div>
        </Divider>

        <div className="col-12 md:col-8 field">
          <div className="input-with-icon-top">
            <div className="icon"><i className="pi pi-user" /></div>
            <div className="input-wrapper">
              <InputText
                placeholder="Nome completo"
                value={manifestation.solicitante.nome}
                onChange={(e) => onChangeSolicitante("nome", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="col-12 md:col-4 field">
          <div className="input-with-icon-top">
            <div className="icon"><i className="pi pi-id-card" /></div>
            <div className="input-wrapper">
              <InputText
                placeholder="CPF"
                value={manifestation.solicitante.cpf}
                onChange={(e) => onChangeSolicitante("cpf", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="col-12 field flex align-items-center gap-2">
          <Checkbox inputId="isPatient" checked={manifestation.solicitanteEhPaciente} onChange={(e: any) => toggleSolicitanteEhPaciente(e.checked ?? false)} />
          <label htmlFor="isPatient" className="cursor-pointer text-sm" style={{ color: "var(--vitae-gray-text)" }}>
            O solicitante é o próprio paciente
          </label>
        </div>

        {!manifestation.solicitanteEhPaciente && (
          <>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-users text-vitae-red mr-2" />
                <b>Dados do Paciente</b>
              </div>
            </Divider>

            <div className="col-12 md:col-8 field">
              <div className="input-with-icon-top">
                <div className="icon"><i className="pi pi-user" /></div>
                <div className="input-wrapper">
                  <InputText
                    placeholder="Nome do paciente"
                    value={manifestation.paciente.nome}
                    onChange={(e) => onChangePaciente("nome", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 md:col-4 field">
              <div className="input-with-icon-top">
                <div className="icon"><i className="pi pi-id-card" /></div>
                <div className="input-wrapper">
                  <InputText
                    placeholder="CPF do paciente"
                    value={manifestation.paciente.cpf}
                    onChange={(e) => onChangePaciente("cpf", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Divider />

        <div className="col-12 md:col-6 field">
          <div className="label-with-icon">
            <i className="pi pi-info-circle text-vitae-gray-text" />
            <span>Status Inicial</span>
          </div>
          <Dropdown
            value={manifestation.status}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => setManifestation({ ...manifestation, status: e.value })}
            placeholder="Selecione o status"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ManifestationForm;