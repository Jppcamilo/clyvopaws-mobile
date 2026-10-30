import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ModoTema } from '../theme/colors';

const CHAVE = '@clyvo_preferencia_tema';
let fila: Promise<void> = Promise.resolve();

export const temaService = {
  async carregar(): Promise<ModoTema | null> {
    const valor = await AsyncStorage.getItem(CHAVE);
    return valor === 'light' || valor === 'dark' ? valor : null;
  },

  salvar(modo: ModoTema): Promise<void> {
    const operacao = fila
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(CHAVE, modo));
    fila = operacao;
    return operacao;
  },
};
