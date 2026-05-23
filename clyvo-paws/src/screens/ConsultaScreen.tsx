import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function ConsultasScreen() {
  const navigation = useNavigation<any>();

  const abrirWhatsApp = (numero: string, nomeClinica: string) => {
    const numeroLimpo = numero.replace(/\D/g, ''); 
    const mensagem = `Olá ${nomeClinica}! Sou do app Clyvo VET e gostaria de marcar uma consulta para o meu pet.`; 
    
    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch((err) => {
      console.error('Erro ao abrir o WhatsApp', err);
      Alert.alert('Erro', 'Não foi possível redirecionar para o WhatsApp.');
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>CONSULTAS</Text>
      <Text style={styles.subtitulo}>CLINICAS PARA MARCAR CONSULTAS</Text>

      <View style={styles.listaClinicas}>
        
        <TouchableOpacity 
          style={styles.cardClinica} 
          activeOpacity={0.8}
          onPress={() => abrirWhatsApp('5511999724459', 'Dr. Pet Domiciliar')}
        >
          <View style={styles.tagNome}>
            <Text style={styles.textoTag}>Dr. Pet Domiciliar</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Atendimento veterinário completo no conforto do seu lar. Sem estresse para o seu pet.
          </Text>
          <View style={styles.boxTelefone}>
            <MaterialCommunityIcons name="whatsapp" size={20} color={colors.verdeClaro} />
            <Text style={styles.textoTelefone}>(11) 99972-4459</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardClinica} 
          activeOpacity={0.8}
          onPress={() => abrirWhatsApp('5511999724459', 'SERES')}
        >
          <View style={styles.tagNome}>
            <Text style={styles.textoTag}>SERES</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Centro veterinário com infraestrutura de ponta e atendimento emergencial 24h.
          </Text>
          <View style={styles.boxTelefone}>
            <MaterialCommunityIcons name="whatsapp" size={20} color={colors.verdeClaro} />
            <Text style={styles.textoTelefone}>(11) 99972-4459</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardClinica} 
          activeOpacity={0.8}
          onPress={() => abrirWhatsApp('5511999724459', 'VET DOMICÍLIO SP')}
        >
          <View style={styles.tagNome}>
            <Text style={styles.textoTag}>VET DOMICÍLIO SP</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Especialistas em felinos e caninos. Realizamos vacinas, exames e check-ups em casa.
          </Text>
          <View style={styles.boxTelefone}>
            <MaterialCommunityIcons name="whatsapp" size={20} color={colors.verdeClaro} />
            <Text style={styles.textoTelefone}>(11) 99972-4459</Text>
          </View>
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
    paddingTop: 50,
  },
  header: {
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  listaClinicas: {
    marginTop: 10,
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
    shadowRadius: 5,
  },
  tagNome: {
    backgroundColor: colors.verdeClaro,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  textoTag: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  textoDescricao: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 15,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  boxTelefone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textoTelefone: {
    color: colors.verdeClaro,
    fontWeight: '900',
    fontSize: 14,
    marginLeft: 8,
  }
});