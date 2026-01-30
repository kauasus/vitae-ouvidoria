// src/types/manifestation.ts
export type Canal = "WHATSAPP" | "RECLAME_AQUI" | "GOOGLE" | "EMAIL";
export type Tipo = "ELOGIO" | "RECLAMACAO";
export type Status = "PENDENTE" | "EM_ANDAMENTO" | "RESOLVIDO";

export interface Person {
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  dataNascimento?: string | null;
  tipoAtendimento?: string | null;
}

export interface Manifestation {
  id: number | string;
  tipo: Tipo;
  canalOrigem: Canal;
  descricao: string;
  solicitante: Person;
  paciente: Person;
  solicitanteEhPaciente?: boolean;
  status: Status;
  dataRegistro: string; // ISO
}