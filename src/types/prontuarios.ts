export type LinkTemporario = {
  id: string;
  login: string;
  senha: string;
  dataExpiracao: string;
  ativo: boolean;
  usado: boolean;
  dataCriacao: string;
};

export type SolicitacaoProntuario = {
  id: string;
  linkId: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  motivo: string;
  aceitouTermo: boolean;
  dataHoraSolicitacao: string;
  ipOrigem?: string;
};