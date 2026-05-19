import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
 
 
export default function AjudaScreen() {
 
    const navigation = useNavigation<any>();
   
  return (
    <View style={styles.containerPrincipal}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
 
        <View style={styles.header}>
          <Text style={styles.titulo}>AJUDA</Text>
        </View>
 
        <Text style={styles.subtitulo}>
          Escolha o melhor canal de atendimento para você ou conheça nosso endereço para um atendimento presencial.
        </Text>
 
        <TouchableOpacity style={styles.cardAjuda} activeOpacity={0.7} onPress={() => navigation.navigate('Chat')}>
          <View style={styles.iconeContainer}>
            <MaterialCommunityIcons name="chat-processing-outline" size={28} color={colors.verdeEscuro} />
          </View>
          <View style={styles.textosContainer}>
            <Text style={styles.tituloCard}>Chat</Text>
            <Text style={styles.descricaoCard}>
              Assistente virtual: 24h.{"\n"}Especialista: De segunda a sexta das 08h às 20h.
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.cardAjuda}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Contatos')}
        >
          <View style={styles.iconeContainer}>
            <MaterialCommunityIcons name="headset" size={28} color={colors.verdeEscuro} />
          </View>
          <View style={styles.textosContainer}>
            <Text style={styles.tituloCard}>Demais contatos</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.cardAjuda} activeOpacity={0.7} onPress={() => navigation.navigate('Enderecos')}>
          <View style={styles.iconeContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={28} color={colors.verdeEscuro} />
          </View>
          <View style={styles.textosContainer}>
            <Text style={styles.tituloCard}>Nossos endereços</Text>
            <Text style={styles.descricaoCard}>
              Locais para atendimento presencial.
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
 
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: colors.branco,
    paddingHorizontal: 20,
    paddingTop: 50
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-start'
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    textTransform: 'uppercase'
  },
  subtitulo: {
    fontSize: 14,
    color: colors.roxoMuitoEscuro,
    marginBottom: 35,
    lineHeight: 22,
    fontWeight: '500'
  },
 
  // Estilo dos Botões (Cards)
  cardAjuda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.branco,
    borderColor: colors.verdeMedio,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  iconeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.verdeClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  textosContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 4
  },
  descricaoCard: {
    fontSize: 12,
    color: colors.cinza,
    fontWeight: 'bold',
    lineHeight: 16
  },
});