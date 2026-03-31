import React, { useState, useEffect } from "react";
import { prontuarioService } from "../../services/prontuarioServices";
import type { LinkTemporario } from "../../types/prontuarios";
import { Link2, Copy, CheckCircle2, XCircle, Clock, Trash2, ShieldCheck, MailPlus } from "lucide-react";

const GerarLinkTemporario: React.FC = () => {
  const [links, setLinks] = useState<LinkTemporario[]>([]);
  const [horasValidade, setHorasValidade] = useState<number>(24);
  const [linkGerado, setLinkGerado] = useState<LinkTemporario | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchLinks = async () => {
    try {
      const data = await prontuarioService.getLinks();
      setLinks(data);
    } catch (err) {
      console.error("Erro ao carregar links", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const gerarNovoLink = async () => {
    setGenerating(true);
    try {
      const novoLink = await prontuarioService.gerarLinkTemporario(horasValidade);
      setLinkGerado(novoLink);
      setCopied(false);
      setShowDialog(true);
      await fetchLinks();
    } catch (err) {
      console.error("Erro ao gerar link", err);
      alert("Falha ao gerar link temporário.");
    } finally {
      setGenerating(false);
    }
  };

  const desativar = async (linkId: string) => {
    if (!confirm("Deseja realmente desativar este link? O paciente perderá o acesso imediatamente.")) return;
    try {
      await prontuarioService.desativarLink(linkId);
      await fetchLinks();
    } catch (err) {
      console.error("Erro ao desativar link", err);
      alert("Falha ao inativar o link.");
    }
  };

  const copiarLink = () => {
    const text = `Acesse seu prontuário em:\nURL: ${window.location.origin}/prontuario/acesso/${linkGerado?.id}\nLogin: ${linkGerado?.login}\nSenha: ${linkGerado?.senha}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatDateTime = (iso: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date(iso));
  };

  const statusTemplate = (rowData: LinkTemporario) => {
    if (rowData.usado) return <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Usado</span>;
    if (!rowData.ativo) return <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Desativado</span>;
    if (new Date(rowData.dataExpiracao) < new Date()) return <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-xs font-semibold"><Clock className="w-3.5 h-3.5" /> Expirado</span>;
    return <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> Ativo</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acesso Externo</h2>
          <p className="text-sm text-gray-500 mt-1">Gerenciamento de links temporários de prontuários</p>
        </div>
      </header>

      {/* Card Gerar Novo Link */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Link2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Gerar Novo Link</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end gap-4 max-w-xl">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold text-gray-700">Validade do link (em horas)</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-4 pr-10 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                value={horasValidade}
                onChange={(e) => setHorasValidade(Number(e.target.value) || 24)}
                min={1}
                max={168}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 text-sm font-medium">h</div>
            </div>
          </div>
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={gerarNovoLink}
            disabled={generating}
          >
            {generating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MailPlus className="w-4 h-4" />
            )}
            {generating ? "Gerando..." : "Gerar Credenciais"}
          </button>
        </div>
      </div>

      {/* Tabela de Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Histórico de Links Gerados</h3>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{links.length} registros</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Carregando histórico...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Link2 className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">Nenhum link gerado ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Gere o primeiro link temporário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Acesso</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Criado em</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Expira em</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900">{link.login}</span>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider bg-gray-100 rounded px-1.5 py-0.5 w-fit">{link.senha}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatDateTime(link.data_criacao)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatDateTime(link.dataExpiracao)}</td>
                    <td className="py-4 px-6">{statusTemplate(link)}</td>
                    <td className="py-4 px-6 text-right">
                      {link.ativo && !link.usado && new Date(link.dataExpiracao) > new Date() && (
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                          onClick={() => desativar(link.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Desativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Dialog de Sucesso */}
      {showDialog && linkGerado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-green-50 px-6 py-5 border-b border-green-100 flex items-center gap-3">
              <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">Link Gerado com Sucesso!</h3>
                <p className="text-sm text-green-700 font-medium mt-0.5">Credenciais prontas para envio</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Envie as informações abaixo para o paciente acessar o prontuário. O link expirará em {horasValidade}h.
              </p>
              
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Acesso Direto</label>
                  <div className="text-sm font-medium text-brand-600 bg-white border border-gray-200 px-3 py-2 rounded-lg truncate select-all">
                    {`${window.location.origin}/prontuario/acesso/${linkGerado.id}`}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Login</label>
                    <div className="text-sm font-medium text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-lg select-all">
                      {linkGerado.login}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Senha</label>
                    <div className="text-sm font-mono font-medium text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-lg select-all text-center tracking-widest uppercase">
                      {linkGerado.senha}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end items-center">
              <button 
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
                onClick={() => setShowDialog(false)}
              >
                Fechar
              </button>
              <button 
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                  copied ? "bg-green-600 hover:bg-green-700" : "bg-brand-600 hover:bg-brand-700"
                }`}
                onClick={copiarLink}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar Credenciais"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerarLinkTemporario;