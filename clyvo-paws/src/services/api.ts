import axios, { CanceledError } from 'axios';

import { sessaoService } from './sessaoService';

const api = axios.create({
  baseURL: 'https://clyvopawsjavachallenge.onrender.com',
  timeout: 15000,
});

function requisicaoPublica(config: {
  method?: string;
  url?: string;
}): boolean {
  return (
    config.method?.toLowerCase() === 'post' &&
    (config.url === '/login' || config.url === '/tutores')
  );
}

function tokenDoHeader(valor: unknown): string | null {
  return typeof valor === 'string' && valor.startsWith('Bearer ')
    ? valor.slice(7)
    : null;
}

api.interceptors.request.use(async (config) => {
  if (requisicaoPublica(config)) {
    config.headers.delete('Authorization');
    return config;
  }

  const tokenEsperado = sessaoService.obterEstado().token;
  const token = await sessaoService.obterToken();

  if (!token || token !== tokenEsperado) {
    throw new CanceledError('Faça login novamente.', config);
  }

  config.headers.set('Authorization', `Bearer ${token}`);

  return config;
});

api.interceptors.response.use(
  (resposta) => {
    if (!requisicaoPublica(resposta.config)) {
      const token = tokenDoHeader(
        resposta.config.headers.get('Authorization'),
      );

      if (token !== sessaoService.obterEstado().token) {
        throw new CanceledError(
          'A sessão mudou.',
          resposta.config,
        );
      }
    }

    return resposta;
  },

  async (erro: unknown) => {
    if (
      axios.isAxiosError(erro) &&
      erro.config &&
      !requisicaoPublica(erro.config) &&
      erro.response?.status === 401
    ) {
      const token = tokenDoHeader(
        erro.config.headers.get('Authorization'),
      );

      if (token) {
        try {
          await sessaoService.invalidar(token);
        } catch {

        }
      }
    }

    return Promise.reject(erro);
  },
);

export default api;