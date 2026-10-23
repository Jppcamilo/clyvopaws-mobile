import api from './api';
import type { LoginResposta } from '../types/api';

export const authService = {
  async login(username: string, password: string) {
    const { data } = await api.post<LoginResposta>('/login', {
      username,
      password,
    });

    return data;
  },
};