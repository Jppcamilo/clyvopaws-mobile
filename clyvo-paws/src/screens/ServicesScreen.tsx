import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function ServicesScreen() {

  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      

      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>


      <Text style={styles.titulo}>NOSSOS SERVIÇOS</Text>
      <Text style={styles.subtitulo}>TUDO PARA VOCÊ CUIDAR DA SAÚDE DO SEU PET</Text>

      <View style={styles.gridContainer}>
        

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('RedeClinica')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="home-outline" size={35} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.textoIcone}>REDE{"\n"}CLINICA</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.gridItem}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="file-document-outline" size={35} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.textoIcone}>MEUS{"\n"}MEDICAMENTOS</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.gridItem}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="shield-check-outline" size={35} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.textoIcone}>COBERTURA{"\n"}DE PLANOS</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={styles.gridItem} 
          onPress={() => navigation.navigate('Pets')}
        >
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="paw" size={35} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.textoIcone}>MEUS PETS</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.gridItem}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="percent" size={35} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.textoIcone}>MEDICAMENTOS{"\n"}COM DESCONTO</Text>
        </TouchableOpacity>


       <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Consultas')}>
        <View style={styles.circuloIcone}>
         <MaterialCommunityIcons name="forum-outline" size={35} color={colors.roxoMuitoEscuro} />
        </View>
        <Text style={styles.textoIcone}>MARCAR{"\n"}CONSULTAS</Text>
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
    marginBottom: 40,
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
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.verdeMedio,
    marginBottom: 50,
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 35,
  },
  circuloIcone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.verdeEscuro,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoIcone: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  }
});