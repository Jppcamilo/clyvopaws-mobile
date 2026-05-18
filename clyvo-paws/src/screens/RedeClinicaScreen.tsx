import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; 
import { colors } from '../theme/colors';

export default function RedeClinicaScreen() {
  const navigation = useNavigation<any>();

  const [localizacaoTexto, setLocalizacaoTexto] = useState<string>('Buscando região...');
  const [carregandoLocal, setCarregandoLocal] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocalizacaoTexto('Permissão negada. Mostrando rede geral.');
          setCarregandoLocal(false);
          return;
        }

        // 🛠️ CORREÇÃO DO GPS: Reduzindo a precisão para "Balanceada" (Usa Wi-Fi/Rede em vez de satélite).
        // Isso resolve o problema de ficar carregando para sempre no emulador ou dentro de casa.
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, 
        });

        let endereco = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (endereco && endereco.length > 0) {
          const local = endereco[0];
          setLocalizacaoTexto(`${local.subregion || local.city || 'Sua região'} - ${local.region || ''}`);
        } else {
          setLocalizacaoTexto('São Paulo - SP'); // Fallback amigável
        }
      } catch (error) {
        console.error("Erro ao buscar localização: ", error);
        setLocalizacaoTexto('São Paulo - SP'); // Se o emulador falhar mesmo assim, mostra um lugar padrão
      } finally {
        setCarregandoLocal(false);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>REDE CLÍNICA</Text>

      <View style={styles.boxLocalizacao}>
        <MaterialCommunityIcons name="map-marker-radius" size={28} color={colors.verdeEscuro} />
        <View style={styles.textosLocalizacao}>
          <Text style={styles.subtituloLocalizacao}>ENCONTRE CLÍNICAS PERTO DE VOCÊ:</Text>
          {carregandoLocal ? (
            <ActivityIndicator size="small" color={colors.verdeEscuro} style={{ alignSelf: 'flex-start', marginTop: 5 }} />
          ) : (
            <Text style={styles.textoEnderecoAtual}>{localizacaoTexto}</Text>
          )}
        </View>
      </View>

      <View style={styles.listaClinicas}>

        <TouchableOpacity style={styles.cardClinica} activeOpacity={0.8}>
          <View style={styles.headerCardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>Dr. Pet Domiciliar</Text>
            </View>
            <View style={styles.tagDistancia}>
              <MaterialCommunityIcons name="map-marker-distance" size={12} color={colors.roxoMuitoEscuro} />
              <Text style={styles.textoDistancia}> 1.2 km</Text>
            </View>
          </View>
          <Text style={styles.textoDescricao}>
            Atendimento veterinário completo no conforto do seu lar. Sem estresse para o seu pet. Base em Pinheiros.
          </Text>
          <Text style={styles.textoTelefone}>(11) 99999-0001</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardClinica} activeOpacity={0.8}>
          <View style={styles.headerCardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>SERES</Text>
            </View>
            <View style={styles.tagDistancia}>
              <MaterialCommunityIcons name="map-marker-distance" size={12} color={colors.roxoMuitoEscuro} />
              <Text style={styles.textoDistancia}> 3.5 km</Text>
            </View>
          </View>
          <Text style={styles.textoDescricao}>
            Centro veterinário com infraestrutura de ponta e atendimento emergencial 24h na região da Paulista.
          </Text>
          <Text style={styles.textoTelefone}>(11) 99999-0002</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardClinica} activeOpacity={0.8}>
          <View style={styles.headerCardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>VET DOMICÍLIO SP</Text>
            </View>
            <View style={styles.tagDistancia}>
              <MaterialCommunityIcons name="map-marker-distance" size={12} color={colors.roxoMuitoEscuro} />
              <Text style={styles.textoDistancia}> 5.0 km</Text>
            </View>
          </View>
          <Text style={styles.textoDescricao}>
            Especialistas em felinos e caninos. Realizamos vacinas, exames e check-ups. Atendimento rápido na Vila Mariana.
          </Text>
          <Text style={styles.textoTelefone}>(11) 99999-0003</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.branco, 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  header: { 
    marginBottom: 20,
    alignItems: 'flex-start' 
  },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textTransform: 'uppercase',
    marginBottom: 25,
  },
  boxLocalizacao: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.verdeClaro, 
    paddingHorizontal: 20, 
    paddingVertical: 25,
    borderRadius: 15, 
    marginBottom: 30 
  },
  textosLocalizacao: { 
    marginLeft: 15, 
    flex: 1 
  },
  subtituloLocalizacao: { 
    fontSize: 12, 
    fontWeight: '900', 
    color: colors.verdeEscuro, 
    textTransform: 'uppercase' 
  },
  textoEnderecoAtual: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.roxoMuitoEscuro, 
    marginTop: 5 
  },
  listaClinicas: { 
    marginTop: 5 
  },
  cardClinica: { 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 25, 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5 
  },
  headerCardClinica: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 15 
  },
  tagNome: { 
    backgroundColor: colors.verdeClaro, 
    paddingHorizontal: 15, 
    paddingVertical: 6, 
    borderRadius: 20, 
    flexShrink: 1, 
    marginRight: 10 
  },
  textoTag: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  tagDistancia: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.branco, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15 
  },
  textoDistancia: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  textoDescricao: { 
    color: colors.branco, 
    fontWeight: 'bold', 
    fontSize: 13, 
    marginBottom: 15, 
    lineHeight: 18 
  },
  textoTelefone: { 
    color: colors.verdeClaro, 
    fontWeight: '900', 
    fontSize: 14, 
    textAlign: 'right' 
  }
});