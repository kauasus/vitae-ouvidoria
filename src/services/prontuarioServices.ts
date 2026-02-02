import type { LinkTemporario, SolicitacaoProntuario } from "../types/prontuarios";

const STORAGE_LINKS = "prontuario_links";
const STORAGE_SOLICITACOES = "prontuario_solicitacoes";

class ProntuarioService {
  // ========== LINKS TEMPORÁRIOS ==========
  
  gerarLinkTemporario(horasValidade: number = 24): LinkTemporario {
    const id = `LINK-${Date.now()}`;
    const login = `paciente${Math.floor(Math.random() * 10000)}`;
    const senha = Math.random().toString(36).substring(2, 10).toUpperCase();
    const dataExpiracao = new Date(Date.now() + horasValidade * 60 * 60 * 1000).toISOString();

    const link: LinkTemporario = {
      id,
      login,
      senha,
      dataExpiracao,
      ativo: true,
      usado: false,
      dataCriacao: new Date().toISOString(),
    };

    const links = this.getLinks();
    links.push(link);
    localStorage.setItem(STORAGE_LINKS, JSON.stringify(links));
    return link;
  }

  getLinks(): LinkTemporario[] {
    const data = localStorage.getItem(STORAGE_LINKS);
    return data ? JSON.parse(data) : [];
  }

  validarCredenciais(login: string, senha: string): LinkTemporario | null {
    const links = this.getLinks();
    const link = links.find(
      (l) =>
        l.login === login &&
        l.senha === senha &&
        l.ativo &&
        !l.usado &&
        new Date(l.dataExpiracao) > new Date()
    );
    return link || null;
  }

  marcarLinkComoUsado(linkId: string): void {
    const links = this.getLinks();
    const link = links.find((l) => l.id === linkId);
    if (link) {
      link.usado = true;
      localStorage.setItem(STORAGE_LINKS, JSON.stringify(links));
    }
  }

  desativarLink(linkId: string): void {
    const links = this.getLinks();
    const link = links.find((l) => l.id === linkId);
    if (link) {
      link.ativo = false;
      localStorage.setItem(STORAGE_LINKS, JSON.stringify(links));
    }
  }

  // ========== SOLICITAÇÕES ==========

  salvarSolicitacao(solicitacao: SolicitacaoProntuario): void {
    const solicitacoes = this.getSolicitacoes();
    solicitacoes.push(solicitacao);
    localStorage.setItem(STORAGE_SOLICITACOES, JSON.stringify(solicitacoes));
    this.marcarLinkComoUsado(solicitacao.linkId);
  }

  getSolicitacoes(): SolicitacaoProntuario[] {
    const data = localStorage.getItem(STORAGE_SOLICITACOES);
    return data ? JSON.parse(data) : [];
  }
}

export const prontuarioService = new ProntuarioService();