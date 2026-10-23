import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export function useRedeClinica() {
  const navigation = useNavigation<any>();

  const [localizacaoTexto, setLocalizacaoTexto] =
    useState('Buscando região...');
  const [carregandoLocal, setCarregandoLocal] = useState(true);
  const [erroLocalizacao, setErroLocalizacao] =
    useState<string | null>(null);

  const telaAtiva = useRef(true);
  const versaoBusca = useRef(0);

  const buscarLocalizacao = useCallback(async () => {
    const versaoAtual = ++versaoBusca.current;

    const buscaValida = () =>
      telaAtiva.current &&
      versaoAtual === versaoBusca.current;

    setCarregandoLocal(true);
    setErroLocalizacao(null);

    try {
      const permissao =
        await Location.requestForegroundPermissionsAsync();

      if (!buscaValida()) return;

      if (!permissao.granted) {
        setLocalizacaoTexto('Localização não autorizada.');
        setErroLocalizacao(
          'Permita o acesso à localização para identificar sua região.',
        );
        return;
      }

      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!buscaValida()) return;

      const enderecos = await Location.reverseGeocodeAsync({
        latitude: localizacao.coords.latitude,
        longitude: localizacao.coords.longitude,
      });

      if (!buscaValida()) return;

      const endereco = enderecos[0];

      const regiao = endereco
        ? [
            endereco.city || endereco.subregion,
            endereco.region,
          ]
            .filter(Boolean)
            .join(' - ')
        : '';

      setLocalizacaoTexto(
        regiao || 'Não foi possível identificar o nome da região.',
      );
    } catch {
      if (buscaValida()) {
        setLocalizacaoTexto('Localização indisponível.');
        setErroLocalizacao(
          'Não foi possível obter sua localização. Tente novamente.',
        );
      }
    } finally {
      if (buscaValida()) {
        setCarregandoLocal(false);
      }
    }
  }, []);

  useEffect(() => {
    telaAtiva.current = true;
    void buscarLocalizacao();

    return () => {
      telaAtiva.current = false;
      versaoBusca.current += 1;
    };
  }, [buscarLocalizacao]);

  return {
    navigation,
    localizacaoTexto,
    carregandoLocal,
    erroLocalizacao,
    buscarLocalizacao,
  };
}