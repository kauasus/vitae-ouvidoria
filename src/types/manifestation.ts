// src/types/manifestation.ts
export type Canal = {
    id: number;
    dsc_canal: string;
}
export type Tipo = {
  id: number;
  dsc_tipo: string;
}
export type Status = {
  id: number;
  dsc_status: string;
}
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
