import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function useFotoGaleria(
  fotoInicial: string | null = null,
  bloqueado = false,
) {
  const [foto, setFoto] = useState<string | null>(fotoInicial);
  const [escolhendoFoto, setEscolhendoFoto] = useState(false);

  const telaAtiva = useRef(true);
  const galeriaAberta = useRef(false);

  useEffect(() => {
    telaAtiva.current = true;

    return () => {
      telaAtiva.current = false;
    };
  }, []);

  const escolherFoto = async () => {
    if (bloqueado || galeriaAberta.current) return;

    galeriaAberta.current = true;
    setEscolhendoFoto(true);

    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!telaAtiva.current) return;

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para selecionar uma foto.',
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!telaAtiva.current) return;

      if (!resultado.canceled && resultado.assets[0]) {
        setFoto(resultado.assets[0].uri);
      }
    } catch {
      if (telaAtiva.current) {
        Alert.alert('Erro', 'Não foi possível selecionar a foto.');
      }
    } finally {
      galeriaAberta.current = false;

      if (telaAtiva.current) {
        setEscolhendoFoto(false);
      }
    }
  };

  return {
    foto,
    setFoto,
    escolhendoFoto,
    escolherFoto,
  };
}