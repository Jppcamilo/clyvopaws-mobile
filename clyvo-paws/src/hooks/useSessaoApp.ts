import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { Alert, AppState } from 'react-native';

import { sessaoService } from '../services/sessaoService';
import { expiracaoToken } from '../utils/jwt';

export function useSessaoApp() {
  const sessao = useSyncExternalStore(
    sessaoService.assinar,
    sessaoService.obterEstado,
    sessaoService.obterEstado,
  );

  const [erro, setErro] = useState<string | null>(null);

  const iniciar = useCallback(async () => {
    setErro(null);

    try {
      await sessaoService.inicializar();
    } catch (falha) {
      const mensagem =
        falha instanceof Error
          ? falha.message
          : 'Não foi possível ler a sessão.';

      if (sessaoService.obterEstado().inicializada) {
        Alert.alert('Atenção', mensagem);
      } else {
        setErro(mensagem);
      }
    }
  }, []);

  useEffect(() => {
    void iniciar();
  }, [iniciar]);

  useEffect(() => {
    if (sessao.expirada) {
      Alert.alert(
        'Sessão encerrada',
        'Sua sessão expirou ou foi recusada pelo servidor. Faça login novamente.',
      );
    }
  }, [sessao.expirada]);

  useEffect(() => {
    const token = sessao.token;

    if (!token) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let encerrado = false;
    let verificando = false;
    let ativo = AppState.currentState === 'active';

    const verificar = async () => {
      if (timer) clearTimeout(timer);
      if (encerrado || !ativo || verificando) return;
      verificando = true;
      try {
        await sessaoService.obterToken();
      } catch {
      } finally {
        verificando = false;
        if (!encerrado && ativo) {
          const atual = sessaoService.obterEstado().token;
          const restante = atual ? expiracaoToken(atual) - Date.now() - 30000 : 60000;
          timer = setTimeout(() => { void verificar(); }, Math.max(15000, Math.min(restante, 60000)));
        }
      }
    };

    void verificar();
    const assinatura = AppState.addEventListener('change', (estado) => {
      ativo = estado === 'active';
      if (timer) clearTimeout(timer);
      if (ativo) void verificar();
    });

    return () => {
      encerrado = true;
      if (timer) clearTimeout(timer);
      assinatura.remove();
    };
  }, [sessao.token, sessao.geracao]);

  return {
    sessao,
    erro,
    tentarNovamente: iniciar,
  };
}
