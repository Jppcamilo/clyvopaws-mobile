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
  lembretes: Lembrete[];
};