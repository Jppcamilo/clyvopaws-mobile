import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
 
export default function EnderecosScreen() {
  const navigation = useNavigation<any>();
 
  return (
    <View style={styles.containerPrincipal}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>
 
        <Text style={styles.titulo}>Nossos endereços</Text>
        <Text style={styles.subtitulo}>
          Caso você deseje um atendimento presencial, dirija-se a um de nossos endereços abaixo:
        </Text>
 
        <Text style={styles.nomeCidade}>São Paulo</Text>
        <View style={styles.cardEndereco}>
          <Text style={styles.textoEndereco}>Av. Moema, 300</Text>
          <Text style={styles.textoEndereco}>Moema - São Paulo - SP</Text>
          <Text style={styles.textoEndereco}>CEP: 04077-020</Text>
         
          <View style={styles.divisor} />
         
          <View style={styles.linhaHorario}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.verdeEscuro} style={{ marginRight: 5 }} />
            <Text style={styles.textoHorario}>Atendimento de 2ª a 6ª das 8h30 às 17h</Text>
          </View>
        </View>
 
        <Text style={styles.nomeCidade}>Rio de Janeiro</Text>
        <View style={styles.cardEndereco}>
          <Text style={styles.textoEndereco}>Rua do Passeio, 42 - 6º andar</Text>
          <Text style={styles.textoEndereco}>Centro - Rio de Janeiro - RJ</Text>
          <Text style={styles.textoEndereco}>CEP: 20021-290</Text>
         
          <View style={styles.divisor} />
         
          <View style={styles.linhaHorario}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.verdeEscuro} style={{ marginRight: 5 }} />
            <Text style={styles.textoHorario}>Atendimento de 2ª a 6ª das 8h30 às 17h</Text>
          </View>
        </View>
 
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
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 10
  },
  subtitulo: {
    fontSize: 14,
    color: colors.roxoMuitoEscuro,
    marginBottom: 35,
    lineHeight: 22,
    fontWeight: '500'
  },
  nomeCidade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginBottom: 10,
    marginTop: 10
  },
  cardEndereco: {
    backgroundColor: colors.branco,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  textoEndereco: {
    fontSize: 14,
    color: colors.roxoMuitoEscuro,
    lineHeight: 22,
    fontWeight: '500'
  },
  divisor: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 15
  },
  linhaHorario: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textoHorario: {
    fontSize: 13,
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold'
  }
});
 