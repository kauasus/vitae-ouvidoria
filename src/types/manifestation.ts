export type Person = {
  id?: number;
  nome: string;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
};

export type Tipo = { id: number; dsc_tipo: string };
export type Canal = { id: number; dsc_canal: string };
export type Status = { id: number; dsc_status: string };

export type UsersShort = {
  id: string; // uuid
  username: string;
  nome?: string | null;
  role?: string | null;
};

export type Manifestation = {
  canalOrigem: string;
  anexos: boolean;
  id?: number;
  tipo: Tipo;
  canal: Canal;
  status: Status;
  descricao: string;
  solicitante: Person;
  paciente?: Person | null;
  usuario?: UsersShort;
  dataRegistro?: string | null;
};