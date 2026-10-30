import api from './api';
import { salvarComFoto } from './fotoService';
import type {
  Id,
  Tutor,
  CadastroTutor,
  AtualizacaoTutor,
} from '../types/api';

function pareceEmail(valor: unknown): valor is string {
  return (
    typeof valor === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
  );
}

function normalizarTutor(tutor: Tutor): Tutor {
  const camposInvertidos =
    !pareceEmail(tutor.email) &&
    pareceEmail(tutor.telefone);

  if (camposInvertidos && typeof tutor.telefone === 'string') {
    return {
      ...tutor,
      email: tutor.telefone,
      telefone: tutor.email,
    };
  }

  return tutor;
}

export const tutorService = {
  async cadastrar(dados: CadastroTutor): Promise<Tutor> {
    const data = await salvarComFoto<Tutor>('post', '/tutores', dados, 'fotoUrl');

    return normalizarTutor(data);
  },

  async buscar(id: Id): Promise<Tutor> {
    const { data } = await api.get<Tutor>(`/tutores/${id}`);

    return normalizarTutor(data);
  },

  async atualizar(
    id: Id,
    dados: AtualizacaoTutor,
  ): Promise<Tutor> {
    const data = await salvarComFoto<Tutor>('put', `/tutores/${id}`, dados, 'foto');

    return normalizarTutor(data);
  },

  async excluir(id: Id): Promise<void> {
    await api.delete(`/tutores/${id}`);
  },
};
