import React from "react";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

type Props = {
  visible: boolean;
  onHide: () => void;
  nome: string;
  cpf: string;
  dataNascimento: string;
  aceitou: boolean;
  onChangeAceite: (value: boolean) => void;
  onConfirmar: () => void;
};

const TermoDialog: React.FC<Props> = ({
  visible,
  onHide,
  nome,
  cpf,
  dataNascimento,
  aceitou,
  onChangeAceite,
  onConfirmar,
}) => {
  const footer = (
    <div className="flex justify-content-end gap-2 pt-3">
      <Button label="Cancelar" icon="pi pi-times" className="p-button-cancelar" onClick={onHide} />
      <Button
        label="Confirmar Solicitação"
        icon="pi pi-check"
        className="p-button-registrar"
        onClick={onConfirmar}
        disabled={!aceitou}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Termo de Responsabilidade para Retirada de Prontuário Médico"
      style={{ width: "700px", maxHeight: "80vh" }}
      footer={footer}
      modal
    >
      <div style={{ maxHeight: "500px", overflowY: "auto", padding: "1rem" }}>
        <h3 className="text-center mb-4">TERMO DE RESPONSABILIDADE</h3>
        <p style={{ textAlign: "justify", lineHeight: "1.8" }}>
          Eu, <strong>{nome || "___________________"}</strong>, portador(a) do CPF{" "}
          <strong>{cpf || "___________________"}</strong>, nascido(a) em{" "}
          <strong>
            {dataNascimento ? new Date(dataNascimento).toLocaleDateString("pt-BR") : "___/___/___"}
          </strong>
          , declaro para os devidos fins que:
        </p>

        <ol style={{ textAlign: "justify", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
          <li className="mb-3">
            Solicito a <strong>retirada/transferência do meu prontuário médico</strong> junto à{" "}
            <strong>Vitae Center</strong>, estando ciente de que este documento contém informações
            confidenciais sobre meu histórico de saúde.
          </li>
          <li className="mb-3">
            Assumo total <strong>responsabilidade</strong> pela guarda, uso e confidencialidade das
            informações contidas no prontuário médico retirado.
          </li>
          <li className="mb-3">
            Estou ciente de que a <strong>Vitae Center</strong> não se responsabiliza por qualquer
            uso indevido, extravio, dano ou divulgação não autorizada do prontuário após sua
            retirada.
          </li>
          <li className="mb-3">
            Comprometo-me a utilizar o prontuário médico exclusivamente para fins legítimos,
            respeitando a legislação vigente sobre proteção de dados pessoais (Lei nº 13.709/2018 -
            LGPD).
          </li>
          <li className="mb-3">
            Declaro que as informações fornecidas neste termo são verdadeiras e que estou ciente das
            implicações legais de declarações falsas.
          </li>
        </ol>

        <p style={{ textAlign: "justify", lineHeight: "1.8", marginTop: "1.5rem" }}>
          Por ser expressão da verdade, firmo o presente termo.
        </p>

        <p style={{ textAlign: "right", marginTop: "2rem", fontStyle: "italic" }}>
          Data: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="flex align-items-center gap-2 mt-4 p-3" style={{ background: "#f9fafb", borderRadius: "8px" }}>
          <Checkbox
            inputId="aceite"
            checked={aceitou}
            onChange={(e) => onChangeAceite(e.checked ?? false)}
          />
          <label htmlFor="aceite" className="cursor-pointer font-bold">
            Estou ciente do termo acima e aceito todas as condições.
          </label>
        </div>
      </div>
    </Dialog>
  );
};

export default TermoDialog;