import React from "react";

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
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onHide}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="termo-title"
        className="relative z-10 max-w-3xl w-full mx-4"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b">
            <h3 id="termo-title" className="text-lg font-semibold text-gray-900">
              Termo de Responsabilidade para Retirada de Prontuário Médico
            </h3>
            <button
              onClick={onHide}
              className="text-gray-400 hover:text-gray-600 ml-4 rounded focus:outline-none"
              aria-label="Fechar"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
            <h4 className="text-center text-base font-bold mb-4">TERMO DE RESPONSABILIDADE</h4>

            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              Eu, <strong>{nome || "___________________"}</strong>, portador(a) do CPF{" "}
              <strong>{cpf || "___________________"}</strong>, nascido(a) em{" "}
              <strong>
                {dataNascimento ? new Date(dataNascimento).toLocaleDateString("pt-BR") : "___/___/___"}
              </strong>
              , declaro para os devidos fins que:
            </p>

            <ol className="list-decimal list-inside space-y-3 text-justify text-gray-700 leading-relaxed mb-4 pl-4">
              <li>
                Solicito a <strong>retirada/transferência do meu prontuário médico</strong> junto à{" "}
                <strong>Vitae Center</strong>, estando ciente de que este documento contém informações
                confidenciais sobre meu histórico de saúde.
              </li>
              <li>
                Assumo total <strong>responsabilidade</strong> pela guarda, uso e confidencialidade das
                informações contidas no prontuário médico retirado.
              </li>
              <li>
                Estou ciente de que a <strong>Vitae Center</strong> não se responsabiliza por qualquer
                uso indevido, extravio, dano ou divulgação não autorizada do prontuário após sua
                retirada.
              </li>
              <li>
                Comprometo-me a utilizar o prontuário médico exclusivamente para fins legítimos,
                respeitando a legislação vigente sobre proteção de dados pessoais (Lei nº 13.709/2018 -
                LGPD).
              </li>
              <li>
                Declaro que as informações fornecidas neste termo são verdadeiras e que estou ciente das
                implicações legais de declarações falsas.
              </li>
            </ol>

            <p className="text-justify text-gray-700 leading-relaxed mt-4">
              Por ser expressão da verdade, firmo o presente termo.
            </p>

            <p className="text-right text-sm italic text-gray-600 mt-6">
              Data: {new Date().toLocaleDateString("pt-BR")}
            </p>

            <div className="mt-6 bg-gray-50 rounded-md p-4 flex items-start gap-3">
              <input
                id="aceite"
                type="checkbox"
                checked={aceitou}
                onChange={(e) => onChangeAceite(e.target.checked)}
                className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="aceite" className="cursor-pointer font-semibold text-gray-800">
                Estou ciente do termo acima e aceito todas as condições.
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button
              onClick={onHide}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={!aceitou}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 transition ${
                aceitou
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-red-400/60 cursor-not-allowed"
              }`}
            >
              Confirmar Solicitação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermoDialog;