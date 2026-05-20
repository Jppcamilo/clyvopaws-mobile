import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function InfoRacaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { racaData } = route.params;

  return (
    <View style={styles.containerPrincipal}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.iconeAlerta}>
          <MaterialCommunityIcons name="shield-check" size={50} color={colors.verdeEscuro} />
        </View>

        <Text style={styles.titulo}>PLANO PREVENTIVO</Text>
        <Text style={styles.subtitulo}>Detectamos que seu pet é um {racaData.nome}. Veja as diretrizes da Clyvo VET para ele:</Text>

        <View style={styles.cardInfo}>
          <Text style={styles.labelSecao}>DOENÇA PREDISPOSTA DA RAÇA</Text>
          <Text style={styles.textoDestaque}>{racaData.doenca}</Text>
          <View style={styles.linhaHorario}>
            <MaterialCommunityIcons name="clock-alert-outline" size={16} color={colors.cinza} />
            <Text style={styles.textoIdade}> Idade de Alerta: {racaData.idadeAlerta}</Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.labelSecao}>DICA DE PREVENÇÃO</Text>
          <Text style={styles.textoNormal}>{racaData.prevencao}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.labelSecao}>CUIDADOS RECOMENDADOS</Text>
          <Text style={styles.textoNormal}>{racaData.cuidados}</Text>
        </View>

        <TouchableOpacity style={styles.botaoConcluir} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotaoConcluir}>VOLTAR</Text>
        </TouchableOpacity>
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: { 
    flex: 1, 
    backgroundColor: colors.verdeClaro, 
    paddingHorizontal: 20, 
    paddingTop: 50 },
  header: { 
    alignItems: 'flex-end', 
    marginBottom: 10 },
  botaoVoltar: { 
    backgroundColor: colors.branco, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' },
  iconeAlerta: { 
    alignItems: 'center', 
    marginBottom: 15 },
  titulo: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textAlign: 'center', 
    marginBottom: 5 },
  subtitulo: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    textAlign: 'center', 
    marginBottom: 30, 
    fontWeight: '500' },
  cardInfo: { 
    backgroundColor: colors.branco, 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 15, 
    elevation: 2 },
  labelSecao: { 
    fontSize: 12, 
    fontWeight: '900', 
    color: colors.verdeMedio, 
    marginBottom: 8 },
  textoDestaque: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 10 },
  linhaHorario: { 
    flexDirection: 'row', 
    alignItems: 'center' },
  textoIdade: { 
    fontSize: 14, 
    color: colors.cinza, 
    fontWeight: 'bold' },
  textoNormal: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    lineHeight: 22, 
    fontWeight: '500' },
  botaoConcluir: { 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 25, 
    paddingVertical: 15, 
    alignItems: 'center', 
    marginTop: 20 },
  textoBotaoConcluir: { 
    color: colors.branco, 
    fontWeight: '900', 
    fontSize: 16 }
});