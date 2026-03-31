import React, { useState } from "react";
import type { SolicitacaoProntuario } from "../../types/prontuarios";
import TermoDialog from "./TermoDialog";
import { prontuarioService } from "../../services/prontuarioServices";

// SECURITY: Valida CPF usando o algoritmo dos dígitos verificadores
const validarCPF = (cpf: string): boolean => {
  const limpo = cpf.replace(/[^\d]/g, "");
  if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(limpo[10]);
};

const validarEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

type Props = {
  linkId: string;
  onSucesso: () => void;
};

const FormularioProntuario: React.FC<Props> = ({ linkId, onSucesso }) => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [showTermo, setShowTermo] = useState(false);
  const [aceitouTermo, setAceitouTermo] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const abrirTermo = () => {
    const novosErros: Record<string, string> = {};

    if (!nomeCompleto.trim() || nomeCompleto.trim().length < 3)
      novosErros.nomeCompleto = "Informe o nome completo (mínimo 3 caracteres).";
    
    if (!validarCPF(cpf))
      novosErros.cpf = "CPF inválido. Verifique os dígitos.";
    
    if (!dataNascimento)
      novosErros.dataNascimento = "Informe a data de nascimento.";
    
    if (!telefone.replace(/[^\d]/g, "").match(/^\d{10,11}$/))
      novosErros.telefone = "Telefone inválido. Use (00) 00000-0000.";
    
    if (!validarEmail(email))
      novosErros.email = "E-mail inválido.";
    
    if (!motivo.trim() || motivo.trim().length < 10)
      novosErros.motivo = "Descreva o motivo (mínimo 10 caracteres).";

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;
    setShowTermo(true);
  };

  const confirmarSolicitacao = async () => {
    const solicitacao: SolicitacaoProntuario = {
      linkId,
      // SECURITY: trim() em todos os campos antes de enviar ao servidor
      nomeCompleto: nomeCompleto.trim(),
      cpf: cpf.replace(/[^\d]/g, ""), // envia apenas os dígitos
      dataNascimento: dataNascimento!.toISOString(),
      telefone: telefone.replace(/[^\d]/g, ""), // apenas dígitos
      email: email.trim().toLowerCase(),
      motivo: motivo.trim(),
      aceitouTermo
    };

    try {
      await prontuarioService.salvarSolicitacao(solicitacao);
      setShowTermo(false);
      onSucesso();
    } catch (e) {
      alert("Erro ao enviar a solicitação.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Solicitação de Retirada de Prontuário Médico
      </h1>

      <form className="grid grid-cols-1 md:grid-cols-12 gap-6" onSubmit={(e) => { e.preventDefault(); abrirTermo(); }}>
        {/* Nome Completo */}
        <div className="md:col-span-8">
          <label htmlFor="nome" className="block mb-2 font-semibold text-gray-700">
            Nome Completo <span className="text-red-600">*</span>
          </label>
          <input
            id="nomeCompleto"
            type="text"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            maxLength={255}
            placeholder="Digite seu nome completo"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition ${
              erros.nomeCompleto ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-600"
            }`}
          />
          {erros.nomeCompleto && <p className="mt-1 text-xs text-red-600 font-medium">{erros.nomeCompleto}</p>}
        </div>

        {/* CPF */}
        <div className="md:col-span-4">
          <label htmlFor="cpf" className="block mb-2 font-semibold text-gray-700">
            CPF <span className="text-red-600">*</span>
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            maxLength={14}
            placeholder="000.000.000-00"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition ${
              erros.cpf ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-600"
            }`}
          />
          {erros.cpf && <p className="mt-1 text-xs text-red-600 font-medium">{erros.cpf}</p>}
        </div>

        {/* Data de Nascimento */}
        <div className="md:col-span-4">
          <label htmlFor="dataNascimento" className="block mb-2 font-semibold text-gray-700">
            Data de Nascimento <span className="text-red-600">*</span>
          </label>
          <input
            id="dataNascimento"
            type="date"
            value={dataNascimento ? dataNascimento.toISOString().substring(0, 10) : ""}
            onChange={(e) => setDataNascimento(e.target.value ? new Date(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
        </div>

        {/* Telefone */}
        <div className="md:col-span-4">
          <label htmlFor="telefone" className="block mb-2 font-semibold text-gray-700">
            Telefone <span className="text-red-600">*</span>
          </label>
          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            maxLength={15}
            placeholder="(00) 00000-0000"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition ${
              erros.telefone ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-600"
            }`}
          />
          {erros.telefone && <p className="mt-1 text-xs text-red-600 font-medium">{erros.telefone}</p>}
        </div>

        {/* E-mail */}
        <div className="md:col-span-4">
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
            E-mail <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="seuemail@exemplo.com"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition ${
              erros.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-600"
            }`}
          />
          {erros.email && <p className="mt-1 text-xs text-red-600 font-medium">{erros.email}</p>}
        </div>

        {/* Motivo */}
        <div className="md:col-span-12">
          <label htmlFor="motivo" className="block mb-2 font-semibold text-gray-700">
            Motivo da Retirada/Transferência <span className="text-red-600">*</span>
          </label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Descreva o motivo da solicitação..."
            className={`w-full border rounded-md px-4 py-2 resize-y focus:outline-none focus:ring-2 transition ${
              erros.motivo ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-600"
            }`}
          />
          {erros.motivo && <p className="mt-1 text-xs text-red-600 font-medium">{erros.motivo}</p>}
        </div>

        {/* Botão */}
        <div className="md:col-span-12 flex justify-end">
          <button
            type="submit"
            className="bg-red-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Solicitar Retirada
          </button>
        </div>
      </form>

      <TermoDialog
        visible={showTermo}
        onHide={() => setShowTermo(false)}
        nome={nomeCompleto}
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