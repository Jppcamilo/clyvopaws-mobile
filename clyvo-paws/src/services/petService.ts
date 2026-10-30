import api from './api';
import { salvarComFoto } from './fotoService';
import type { Pet } from '../types';
import type { Id, PetPayload } from '../types/api';

export const petService = {
  async listarPorTutor(tutorId: Id) {
    const { data } = await api.get<Pet[]>(
      `/pets/tutor/${tutorId}`,
    );

    return data;
  },

  async buscar(id: Id) {
    const { data } = await api.get<Pet>(`/pets/${id}`);
    return data;
  },

  async cadastrar(dados: PetPayload) {
    return salvarComFoto<Pet>('post', '/pets', dados, 'fotoUrl');
  },

  async atualizar(id: Id, dados: PetPayload) {
    return salvarComFoto<Pet>('put', `/pets/${id}`, dados, 'fotoUrl');
  },

  async excluir(id: Id) {
    await api.delete(`/pets/${id}`);
  },
};
