export type User = {
  id: string;
  username: string;
  role: "admin" | "user";
  nome: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};