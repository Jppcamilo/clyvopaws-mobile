import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

import { tokenDentroDoPrazo } from '../utils/jwt';
import type { SessaoTutor } from '../types/api';

const TOKEN_KEY = 'clyvo_token';
const TUTOR_KEY = '@tutor_clyvo';

type EstadoSessao = {
  inicializada: boolean;
  token: string | null;
  tutor: SessaoTutor | null;
  expirada: boolean;
};

let estado: EstadoSessao = {
  inicializada: false,
  token: null,
  tutor: null,
  expirada: false,
};

const ouvintes = new Set<() => void>();
let fila: Promise<unknown> = Promise.resolve();

function executar<T>(operacao: () => Promise<T>): Promise<T> {
  const resultado = fila.then(operacao);

  fila = resultado.catch(() => undefined);

  return resultado;
}

function publicar(
  token: string | null,
  tutor: SessaoTutor | null,
  expirada = false,
) {
  estado = {
    inicializada: true,
    token,
    tutor,
    expirada,
  };

  ouvintes.forEach((ouvinte) => ouvinte());
}

function tutorValido(valor: unknown): valor is SessaoTutor {
  if (!valor || typeof valor !== 'object') return false;

  const tutor = valor as Partial<SessaoTutor>;

  return (
    typeof tutor.id === 'number' &&
    Number.isInteger(tutor.id) &&
    tutor.id > 0 &&
    typeof tutor.nomeCompleto === 'string' &&
    (tutor.fotoUrl == null || typeof tutor.fotoUrl === 'string')
  );
}

async function limparArquivos(): Promise<void> {
  const resultados = await Promise.allSettled([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    AsyncStorage.removeItem(TUTOR_KEY),
    Notifications.cancelAllScheduledNotificationsAsync(),
  ]);

  if (resultados.some((resultado) => resultado.status === 'rejected')) {
    throw new Error(
      'A sessão foi encerrada, mas houve uma falha na limpeza dos dados ou lembretes locais.',
    );
  }
}

function inicializar(): Promise<void> {
  return executar(async () => {
    if (estado.inicializada) return;

    const [token, dados] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      AsyncStorage.getItem(TUTOR_KEY),
    ]);

    let tutor: unknown = null;

    try {
      tutor = dados ? JSON.parse(dados) : null;
    } catch {
    }

    if (token && tokenDentroDoPrazo(token) && tutorValido(tutor)) {
      publicar(token, {
        ...tutor,
        fotoUrl: tutor.fotoUrl ?? null,
      });
      return;
    }

    publicar(null, null);
    await limparArquivos();
  });
}

function invalidar(tokenEsperado: string): Promise<void> {
  return executar(async () => {
    if (estado.token !== tokenEsperado) return;

    publicar(null, null, true);
    await limparArquivos();
  });
}

async function obterToken(): Promise<string | null> {
  await inicializar();

  const token = estado.token;

  if (token && !tokenDentroDoPrazo(token)) {
    await invalidar(token);
  }

  return estado.token;
}

async function obterTutor(): Promise<SessaoTutor | null> {
  await obterToken();
  return estado.tutor;
}

async function exigirTutor(): Promise<SessaoTutor> {
  const tutor = await obterTutor();

  if (!tutor) {
    throw new Error(
      'Sua sessão não está disponível. Faça login novamente.',
    );
  }

  return tutor;
}

function salvar(token: string, tutor: SessaoTutor): Promise<void> {
  return executar(async () => {
    if (!tokenDentroDoPrazo(token) || !tutorValido(tutor)) {
      throw new Error(
        'O servidor retornou uma sessão inválida ou expirada.',
      );
    }

    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await AsyncStorage.setItem(TUTOR_KEY, JSON.stringify(tutor));
    } catch {
      publicar(null, null);
      await limparArquivos();

      throw new Error(
        'Não foi possível salvar a sessão neste aparelho.',
      );
    }

    publicar(token, tutor);
  });
}

function salvarTutor(tutor: SessaoTutor): Promise<void> {
  return executar(async () => {
    if (
      !estado.token ||
      estado.tutor?.id !== tutor.id ||
      !tutorValido(tutor)
    ) {
      throw new Error('A sessão mudou. Entre novamente na conta.');
    }

    await AsyncStorage.setItem(TUTOR_KEY, JSON.stringify(tutor));

    publicar(estado.token, tutor);
  });
}

function limpar(): Promise<void> {
  return executar(async () => {
    publicar(null, null);
    await limparArquivos();
  });
}

export const sessaoService = {
  inicializar,
  obterToken,
  obterTutor,
  exigirTutor,
  salvar,
  salvarTutor,
  limpar,
  invalidar,

  obterEstado: () => estado,

  assinar: (ouvinte: () => void) => {
    ouvintes.add(ouvinte);

    return () => {
      ouvintes.delete(ouvinte);
    };
  },
};