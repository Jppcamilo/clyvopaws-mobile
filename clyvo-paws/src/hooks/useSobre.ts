import { Alert, Linking } from 'react-native';
import { SOBRE_APP } from '../data/sobre';
import { obterInformacoesVersao } from '../services/sobreService';

export function useSobre() {
  const informacoes = obterInformacoesVersao();

  const abrir = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Não foi possível abrir o link', 'Tente novamente ou abra o endereço exibido no seu navegador.');
    }
  };

  return {
    ...informacoes,
    sobre: SOBRE_APP,
    abrirRepositorio: () => abrir(SOBRE_APP.repositorio),
    abrirCommit: async () => {
      if (informacoes.commit) {
        await abrir(`${SOBRE_APP.repositorio}/commit/${informacoes.commit}`);
      }
    },
  };
}
