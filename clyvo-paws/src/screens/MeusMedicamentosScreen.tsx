import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { Pet } from '../types';
 
export default function MeusMedicamentosScreen() {
  const navigation = useNavigation<any>();
  const [listaPets, setListaPets] = useState<Pet[]>([]);
  const [carregando, setCarregando] = useState(true);
 
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
          if (dadosTutor) {
            const tutor = JSON.parse(dadosTutor);
            const chavePets = `@pets_${tutor.email}`;
            const petsSalvos = await AsyncStorage.getItem(chavePets);
           
            if (petsSalvos) {
              setListaPets(JSON.parse(petsSalvos));
            } else {
              setListaPets([]);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar pets nos medicamentos:', error);
        } finally {
          setCarregando(false);
        }
      };
 
      carregarDados();
    }, [])
  );
 
  return (
    <View style={styles.containerPrincipal}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>
 
      <Text style={styles.titulo}>MEUS MEDICAMENTOS</Text>
      <Text style={styles.subtitulo}>ACOMPANHE O TRATAMENTO DO SEU PET</Text>
 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
       
        {carregando ? (
          <ActivityIndicator size="large" color={colors.verdeEscuro} style={{ marginTop: 50 }} />
        ) : listaPets.length === 0 ? (
         
          <View style={styles.containerVazio}>
            <MaterialCommunityIcons name="medical-bag" size={60} color={colors.verdeClaro} />
            <Text style={styles.tituloVazio}>Nenhum tratamento ativo</Text>
            <Text style={styles.textoVazio}>
              Você ainda não possui pets cadastrados. Cadastre seu pet para gerenciar os medicamentos e laudos médicos!
            </Text>
            <TouchableOpacity
              style={styles.botaoCadastrarPet}
              onPress={() => navigation.navigate('CadastroPet')}
            >
              <Text style={styles.textoBotaoCadastrar}>CADASTRAR PET</Text>
            </TouchableOpacity>
          </View>
 
        ) : (
 
          listaPets.map((pet, index) => (
            <View key={pet.id} style={styles.cardPet}>
              <View style={styles.headerCard}>
                <MaterialCommunityIcons name="paw" size={20} color={colors.verdeEscuro} />
                <Text style={styles.nomePet}>{pet.nome}</Text>
              </View>
              <View style={styles.cardMedicamento}>
                <View style={styles.iconeRemedio}>
                  <MaterialCommunityIcons name="pill" size={24} color={colors.branco} />
                </View>
                <View style={styles.infoRemedio}>
                  <Text style={styles.nomeRemedio}>Meloxicam 1mg</Text>
                  <Text style={styles.dosagemRemedio}>1 comprimido a cada 24h</Text>
                  <Text style={styles.duracaoRemedio}>Uso contínuo (5 dias)</Text>
                </View>
              </View>
 
              {index === 0 && (
                <View style={styles.cardMedicamento}>
                  <View style={styles.iconeRemedio}>
                    <MaterialCommunityIcons name="bottle-tonic-plus" size={24} color={colors.branco} />
                  </View>
                  <View style={styles.infoRemedio}>
                    <Text style={styles.nomeRemedio}>Ograx-3 (Suplemento)</Text>
                    <Text style={styles.dosagemRemedio}>1 cápsula junto com a refeição</Text>
                    <Text style={styles.duracaoRemedio}>Uso contínuo (30 dias)</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
 
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
    paddingTop: 50 },
  header: { 
    marginBottom: 30, 
    alignItems: 'flex-start' },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' },
  titulo: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textTransform: 'uppercase' },
  subtitulo: { 
    fontSize: 12, 
    fontWeight: '900', 
    color: colors.verdeEscuro, 
    marginBottom: 25, 
    textTransform: 'uppercase' },
  scrollContainer: { 
    flexGrow: 1 },
 
  containerVazio: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 20, 
    padding: 30, 
    marginTop: 20, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5 },
  tituloVazio: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: colors.verdeClaro, 
    marginTop: 15, 
    marginBottom: 10, 
    textAlign: 'center' },
  textoVazio: { 
    fontSize: 14, 
    color: colors.branco, 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 25, 
    fontWeight: '500' },
  botaoCadastrarPet: { 
    backgroundColor: colors.verdeClaro, 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 25 },
  textoBotaoCadastrar: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 14 },
 
  cardPet: { 
    marginBottom: 30 },
  headerCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    backgroundColor: colors.verdeClaro, 
    alignSelf: 'flex-start', 
    paddingHorizontal: 15, 
    paddingVertical: 5, borderRadius: 20 },
  nomePet: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.verdeEscuro, 
    marginLeft: 8, 
    textTransform: 'uppercase' },
  cardMedicamento: { 
    flexDirection: 'row', 
    backgroundColor: colors.branco, 
    borderColor: colors.verdeMedio, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15, 
    elevation: 2, shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3 },
  iconeRemedio: { 
    backgroundColor: colors.roxoMuitoEscuro, 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 },
  infoRemedio: { 
    flex: 1, 
    justifyContent: 'center' },
  nomeRemedio: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 3 },
  dosagemRemedio: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: colors.verdeEscuro, 
    marginBottom: 3 },
  duracaoRemedio: { 
    fontSize: 12, 
    color: colors.cinza, 
    fontWeight: 'bold' },
});
 