import axios, { CanceledError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './httpAuth';
import { sessaoService } from './sessaoService';

type ConfigSessao = InternalAxiosRequestConfig & { geracaoSessao?: number; renovacaoTentada?: boolean };
const api = axios.create(API_CONFIG);
const publica = (c: { method?: string; url?: string }) =>
  c.method?.toLowerCase() === 'post' && ['/login', '/tutores', '/auth/refresh', '/auth/logout'].includes(c.url ?? '');

api.interceptors.request.use(async (original) => {
  const config = original as ConfigSessao;
  if (publica(config)) { config.headers.delete('Authorization'); return config; }
  await sessaoService.inicializar();
  const geracao = config.geracaoSessao ?? sessaoService.obterEstado().geracao;
  const token = await sessaoService.obterToken();
  if (!token || sessaoService.obterEstado().geracao !== geracao || config.signal?.aborted) {
    throw new CanceledError('A sessão mudou ou a operação foi cancelada.', config);
  }
  config.geracaoSessao = geracao;
  config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
api.interceptors.response.use(resposta => {
  const config = resposta.config as ConfigSessao;
  if (!publica(config) && config.geracaoSessao !== sessaoService.obterEstado().geracao) {
    throw new CanceledError('A sessão mudou.', config);
  }
  return resposta;
}, async (erro: unknown) => {
  if (!axios.isAxiosError(erro) || !erro.config || publica(erro.config)) return Promise.reject(erro);
  const config = erro.config as ConfigSessao;
  const geracao = config.geracaoSessao;
  if (geracao !== sessaoService.obterEstado().geracao || config.signal?.aborted) {
    throw new CanceledError('A sessão mudou ou a operação foi cancelada.', config);
  }
  if (erro.response?.status !== 401 || geracao === undefined) return Promise.reject(erro);
  const header = config.headers.get('Authorization');
  const token = typeof header === 'string' ? header.replace(/^Bearer /, '') : '';
  if (config.renovacaoTentada) {
    await sessaoService.invalidar(token, geracao).catch(() => undefined);
    return Promise.reject(erro);
  }
  config.renovacaoTentada = true;
  const novo = await sessaoService.renovarApos401(token, geracao);
  if (!novo || geracao !== sessaoService.obterEstado().geracao || config.signal?.aborted) {
    throw new CanceledError('Faça login novamente.', config);
  }
  return api.request(config);
});
export default api;
