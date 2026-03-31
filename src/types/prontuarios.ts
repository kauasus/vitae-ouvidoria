export type LinkTemporario = {
  id: string;
  login: string;
  senha: string;
  dataExpiracao: string;
  data_criacao: string;
  ativo: boolean;
  usado: boolean;
};

export type SolicitacaoProntuario = {
  id?: string;
  linkId: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  motivo: string;
  aceitouTermo: boolean;
  dataHoraSolicitacao?: string;
  ipOrigem?: string;
};