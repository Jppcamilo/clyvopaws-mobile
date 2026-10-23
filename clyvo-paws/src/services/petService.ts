import api from './api';
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
    const { data } = await api.post<Pet>('/pets', dados);
    return data;
  },

  async atualizar(id: Id, dados: PetPayload) {
    const { data } = await api.put<Pet>(`/pets/${id}`, dados);
    return data;
  },

  async excluir(id: Id) {
    await api.delete(`/pets/${id}`);
  },
};