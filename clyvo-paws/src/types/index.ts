export type Usuario = {
  nomeCompleto: string; 
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;  
  fotoUrl?: string;   
  endereco?: any;       
};

export type Lembrete = {
  data: string;
  tarefa: string;
  horario: string;
};

export type Pet = {
  id: number;
  nome: string;
  especie: 'CACHORRO' | 'GATO';
  dataNascimento: string;
  raca: string;
  peso: number | null;
  sexo: 'MACHO' | 'FEMEA' | null;
  descricao: string | null;
  fotoUrl: string | null;
  tutor: {
    id: number;
    nomeCompleto: string;
  };
  foto?: string | null;
  lembretes?: Lembrete[];
};

export type Produto = {
  id: string;
  nome: string;
  precoAntigo?: string;
  precoNovo: string;
  imagem: any;
  categoria: string;
};