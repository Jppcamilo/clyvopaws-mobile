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

    const verificar = () => {
      if (timer) clearTimeout(timer);

      const restante = expiracaoToken(token) - Date.now();

      if (restante <= 0) {
        void sessaoService.invalidar(token).catch((falha: unknown) => {
          Alert.alert(
            'Atenção',
            falha instanceof Error
              ? falha.message
              : 'Falha ao limpar a sessão.',
          );
        });
      } else {
        timer = setTimeout(verificar, Math.min(restante, 60000));
      }
    };

    verificar();

    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') verificar();
    });

    return () => {
      if (timer) clearTimeout(timer);
      assinatura.remove();
    };
  }, [sessao.token]);

  return {
    sessao,
    erro,
    tentarNovamente: iniciar,
  };
}