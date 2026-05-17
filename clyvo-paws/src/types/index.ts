export type Usuario = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  foto?: string;
};

export type Lembrete = {
  id: string;
  tarefa: string;
  horario: string;
};

export type Pet = {
  id: string;
  nome: string;
  idade: string;
  raca: string;
  descricao?: string;
  foto?: string;
  lembretes: Lembrete[];
};