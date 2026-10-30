import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { httpAuth } from './httpAuth';
import { expiracaoToken, tokenDentroDoPrazo } from '../utils/jwt';
import type { LoginResposta, SessaoTutor } from '../types/api';

const SESSION_KEY = 'clyvo_session_v2';
type Credenciais = { token: string; refreshToken: string; refreshExpiresAt: number; tutor: SessaoTutor };
type EstadoSessao = {
  inicializada: boolean; token: string | null; tutor: SessaoTutor | null;
  expirada: boolean; geracao: number;
};
let estado: EstadoSessao = { inicializada: false, token: null, tutor: null, expirada: false, geracao: 0 };
let credenciais: Credenciais | null = null;
let fila: Promise<unknown> = Promise.resolve();
let renovacao: { geracao: number; promessa: Promise<string | null> } | null = null;
const ouvintes = new Set<() => void>();

function executar<T>(acao: () => Promise<T>): Promise<T> {
  const resultado = fila.then(acao);
  fila = resultado.catch(() => undefined);
  return resultado;
}
function publicar(dados: Credenciais | null, expirada = false, trocarSessao = false) {
  credenciais = dados;
  estado = { inicializada: true, token: dados?.token ?? null, tutor: dados?.tutor ?? null,
    expirada, geracao: estado.geracao + (trocarSessao ? 1 : 0) };
  ouvintes.forEach(fn => fn());
}
function tutorValido(v: unknown): v is SessaoTutor {
  if (!v || typeof v !== 'object') return false;
  const t = v as Partial<SessaoTutor>;
  return typeof t.id === 'number' && Number.isSafeInteger(t.id) && t.id > 0 &&
    typeof t.nomeCompleto === 'string' && (t.fotoUrl == null || typeof t.fotoUrl === 'string');
}
function credenciaisValidas(v: unknown): v is Credenciais {
  if (!v || typeof v !== 'object') return false;
  const c = v as Partial<Credenciais>;
  return typeof c.token === 'string' && expiracaoToken(c.token) > 0 &&
    typeof c.refreshToken === 'string' && /^[A-Za-z0-9_-]{43}$/.test(c.refreshToken) &&
    typeof c.refreshExpiresAt === 'number' && Number.isFinite(c.refreshExpiresAt) && tutorValido(c.tutor);
}
async function limparArquivos() {
  // Um registro único grava o par de tokens junto, evitando misturar rotações.
  const resultados = await Promise.allSettled([
    SecureStore.deleteItemAsync(SESSION_KEY),
    SecureStore.deleteItemAsync('clyvo_token'),
    AsyncStorage.removeItem('@tutor_clyvo'),
    Notifications.cancelAllScheduledNotificationsAsync(),
    Notifications.dismissAllNotificationsAsync(),
  ]);
  if (resultados.some(r => r.status === 'rejected')) {
    throw new Error('A conta foi desconectada, mas houve falha ao limpar dados ou lembretes locais.');
  }
}
function inicializar(): Promise<void> {
  return executar(async () => {
    if (estado.inicializada) return;
    const inicio = estado.geracao;
    const texto = await SecureStore.getItemAsync(SESSION_KEY);
    if (estado.geracao !== inicio) return;
    let salvo: unknown;
    try { salvo = texto ? JSON.parse(texto) : null; } catch { salvo = null; }
    if (credenciaisValidas(salvo) && salvo.refreshExpiresAt > Date.now()) {
      publicar(salvo, false, true);
      return;
    }
    // Sessões antigas sem refresh exigem um novo login uma única vez após a atualização.
    publicar(null, false, true);
    await limparArquivos();
  });
}
async function revogar(refreshToken: string): Promise<void> {
  await httpAuth.post('/auth/logout', { refreshToken }, { timeout: 10000 });
}
async function encerrar(expirada: boolean): Promise<void> {
  const antiga = credenciais;
  publicar(null, expirada, true); // invalida imediatamente qualquer renovação em andamento
  const limpeza = executar(limparArquivos);
  const resultados = await Promise.allSettled([
    limpeza,
    antiga ? revogar(antiga.refreshToken) : Promise.resolve(),
  ]);
  if (resultados[0].status === 'rejected') throw resultados[0].reason;
  if (resultados[1].status === 'rejected') {
    throw new Error('Você saiu deste aparelho, mas não foi possível confirmar o encerramento no servidor.');
  }
}
async function invalidar(tokenEsperado: string, geracao = estado.geracao): Promise<void> {
  if (estado.geracao !== geracao || estado.token !== tokenEsperado) return;
  await encerrar(true);
}

function renovar(): Promise<string | null> {
  const atual = credenciais;
  const geracao = estado.geracao;
  if (!atual) return Promise.resolve(null);
  if (renovacao?.geracao === geracao) return renovacao.promessa;
  const tarefa = { geracao, promessa: Promise.resolve<string | null>(null) };
  tarefa.promessa = (async () => {
    if (atual.refreshExpiresAt <= Date.now()) {
      await invalidar(atual.token, geracao).catch(() => undefined);
      return null;
    }
    let resposta: LoginResposta;
    try {
      const r = await httpAuth.post<LoginResposta>('/auth/refresh', { refreshToken: atual.refreshToken });
      resposta = r.data;
    } catch (erro) {
      if (estado.geracao !== geracao) return null;
      if (axios.isAxiosError(erro) && [401, 403].includes(erro.response?.status ?? 0)) {
        await invalidar(atual.token, geracao).catch(() => undefined);
        return null;
      }
      // Sem rede/5xx/timeout: não destrói as credenciais nem volta ao login.
      throw new Error('Não foi possível renovar sua sessão. Confira a conexão e tente novamente.');
    }
    if (estado.geracao !== geracao) {
      if (typeof resposta.refreshToken === 'string') await revogar(resposta.refreshToken).catch(() => undefined);
      return null;
    }
    const novos = { token: resposta.token, refreshToken: resposta.refreshToken,
      refreshExpiresAt: resposta.refreshExpiresAt, tutor: estado.tutor };
    if (!credenciaisValidas(novos) || !tokenDentroDoPrazo(novos.token) ||
        novos.refreshExpiresAt <= Date.now() || resposta.id !== atual.tutor.id || resposta.role !== 'TUTOR') {
      await invalidar(atual.token, geracao).catch(() => undefined);
      throw new Error('O servidor retornou uma sessão inválida. Faça login novamente.');
    }
    try {
      return await executar(async () => {
        if (estado.geracao !== geracao) return null;
        // Uma edição do perfil durante a chamada não é sobrescrita pela resposta do refresh.
        const dados = { ...novos, tutor: credenciais!.tutor };
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(dados));
        if (estado.geracao !== geracao) return null;
        publicar(dados);
        return dados.token;
      });
    } catch {
      if (estado.geracao === geracao) {
        await invalidar(atual.token, geracao).catch(() => undefined);
      }
      await revogar(novos.refreshToken).catch(() => undefined);
      throw new Error('Não foi possível guardar a sessão renovada. Faça login novamente.');
    }
  })().finally(() => { if (renovacao === tarefa) renovacao = null; });
  renovacao = tarefa;
  return tarefa.promessa;
}
async function obterToken(): Promise<string | null> {
  await inicializar();
  if (!credenciais) return null;
  if (credenciais.refreshExpiresAt <= Date.now() || expiracaoToken(credenciais.token) <= Date.now() + 30000) {
    return renovar();
  }
  return credenciais.token;
}
async function renovarApos401(tokenRecusado: string, geracao: number): Promise<string | null> {
  if (estado.geracao !== geracao) return null;
  if (estado.token !== tokenRecusado && estado.token && tokenDentroDoPrazo(estado.token)) return estado.token;
  return renovar();
}
async function obterTutor() { await obterToken(); return estado.tutor; }
async function exigirTutor(): Promise<SessaoTutor> {
  const tutor = await obterTutor();
  if (!tutor) throw new Error('Sua sessão não está disponível. Faça login novamente.');
  return tutor;
}
async function salvar(token: string, tutor: SessaoTutor, refreshToken: string, refreshExpiresAt: number) {
  const dados = { token, tutor, refreshToken, refreshExpiresAt };
  if (!credenciaisValidas(dados) || !tokenDentroDoPrazo(token) || refreshExpiresAt <= Date.now()) {
    throw new Error('O servidor não retornou uma sessão com renovação válida. Confira a atualização da API Java.');
  }
  const geracao = estado.geracao + 1;
  // Trocar conta invalida operações antigas antes de gravar a nova sessão.
  publicar(null, false, true);
  await executar(async () => {
    if (estado.geracao !== geracao) {
      await revogar(refreshToken).catch(() => undefined);
      throw new Error('A sessão mudou. Tente entrar novamente.');
    }
    try {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(dados));
    } catch {
      await limparArquivos().catch(() => undefined);
      await revogar(refreshToken).catch(() => undefined);
      throw new Error('Não foi possível salvar a sessão neste aparelho.');
    }
    if (estado.geracao !== geracao) {
      await revogar(refreshToken).catch(() => undefined);
      throw new Error('A sessão mudou. Tente entrar novamente.');
    }
    publicar(dados);
  });
}
function salvarTutor(tutor: SessaoTutor) {
  const geracao = estado.geracao;
  return executar(async () => {
    if (!credenciais || estado.geracao !== geracao || estado.tutor?.id !== tutor.id || !tutorValido(tutor)) {
      throw new Error('A sessão mudou. Entre novamente na conta.');
    }
    const dados = { ...credenciais, tutor };
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(dados));
    if (estado.geracao === geracao) publicar(dados);
  });
}
export const sessaoService = {
  inicializar, obterToken, obterTutor, exigirTutor, salvar, salvarTutor,
  limpar: () => encerrar(false), invalidar, renovarApos401,
  obterEstado: () => estado,
  assinar: (ouvinte: () => void) => { ouvintes.add(ouvinte); return () => { ouvintes.delete(ouvinte); }; },
};
