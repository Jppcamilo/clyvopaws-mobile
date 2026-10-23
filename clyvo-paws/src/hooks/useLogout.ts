import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { sessaoService } from '../services/sessaoService';

export function useLogout() {
  const queryClient = useQueryClient();

  const [saindo, setSaindo] = useState(false);
  const executando = useRef(false);

  const sair = async () => {
    if (executando.current) return;

    executando.current = true;
    setSaindo(true);

    try {
      await queryClient.cancelQueries();
      await sessaoService.limpar();

      queryClient.clear();
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível concluir a limpeza da sessão.',
      );
    } finally {
      executando.current = false;
      setSaindo(false);
    }
  };

  return {
    sair,
    saindo,
  };
}