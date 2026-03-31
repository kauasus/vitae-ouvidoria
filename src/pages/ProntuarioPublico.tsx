/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioProntuario from "../components/prontuario/FormularioProntuario";
import { prontuarioService } from "../services/prontuarioServices";
import { Lock, User, KeyRound, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

const ProntuarioPublico: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  
  const [autenticado, setAutenticado] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [validando, setValidando] = useState(false);

  const autenticar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErro("");
    setValidando(true);
    try {
      if (!linkId) throw new Error("Link inválido.");
      await prontuarioService.validarCredenciais(linkId, login, senha);
      setAutenticado(true);
      setErro("");
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || "Login, senha incorretos ou link expirado.");
    } finally {
      setValidando(false);
    }
  };

  const handleSucesso = () => {
    setSucesso(true);
  };

  const fechar = () => {
    try {
      window.close();
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 animate-in zoom-in-95 duration-300">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Solicitação Concluída!</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Sua solicitação de retirada de prontuário foi registrada com sucesso. Em breve a nossa equipe entrará em contato.
          </p>
          <button
            onClick={fechar}
            className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
          >
            Encerrar Atendimento
          </button>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-[420px]">
          {/* Logo / Brand Header placeholder */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="bg-brand-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Acesso Seguro</h1>
            <p className="text-sm font-medium text-gray-500 mt-2">Valide suas credenciais para acessar o formulário do prontuário médico.</p>
          </div>

          <form onSubmit={autenticar} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="login" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Ex: PRON-123456"
                    className="block w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3.5 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <KeyRound className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha temporária"
                    className="block w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3.5 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 font-mono tracking-widest placeholder:tracking-normal"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800 leading-snug">{erro}</p>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={validando}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-wait"
              >
                {validando ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Validando Acesso...
                  </div>
                ) : (
                  "Autenticar"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border text-sm font-semibold rounded-xl text-gray-600 border-gray-200 hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Página Inicial
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="max-w-[800px] mx-auto">
        <FormularioProntuario linkId={linkId!} onSucesso={handleSucesso} />
      </div>
    </div>
  );
};

export default ProntuarioPublico;