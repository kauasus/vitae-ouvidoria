import api from "../api/api";
import type { LinkTemporario, SolicitacaoProntuario } from "../types/prontuarios";

export const prontuarioService = {
  // ========== LINKS TEMPORÁRIOS ==========
  
  async gerarLinkTemporario(horasValidade: number = 24): Promise<LinkTemporario> {
    const res = await api.post("/prontuarios/admin/links", { horasValidade });
    return res.data;
  },

  async getLinks(): Promise<LinkTemporario[]> {
    const res = await api.get("/prontuarios/admin/links");
    return res.data;
  },

  async desativarLink(linkId: string): Promise<void> {
    await api.delete(`/prontuarios/admin/links/${linkId}`);
  },

  // ========== ACESSO PÚBLICO ==========
  
  async validarCredenciais(linkId: string, login: string, senha: string): Promise<LinkTemporario> {
    const res = await api.post("/prontuarios/public/validar-acesso", { linkId, login, senha });
    return res.data.link; // Backend envia: { valid: true, link: {...} }
  },

  // ========== SOLICITAÇÕES ==========

  async salvarSolicitacao(solicitacao: SolicitacaoProntuario): Promise<SolicitacaoProntuario> {
    const res = await api.post("/prontuarios/public/solicitar", solicitacao);
    return res.data;
  },

  async getSolicitacoes(): Promise<SolicitacaoProntuario[]> {
    const res = await api.get("/prontuarios/admin/solicitacoes");
    return res.data;
  }
};