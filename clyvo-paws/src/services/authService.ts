import { httpAuth } from './httpAuth';
import type { LoginResposta } from '../types/api';

export const authService = {
  async login(username: string, password: string) {
    const { data } = await httpAuth.post<LoginResposta>('/login', {
      username,
      password,
    });

    return data;
  },
};
