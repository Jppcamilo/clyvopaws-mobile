import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import api from '../services/api';

export default function MedicamentosScreen() {
  const navigation = useNavigation<any>();
  const [tutorId, setTutorId] = useState<string | null>(null);

  // 1. Busca o ID do Tutor logado
  useEffect(() => {
    const buscarIdLocal = async () => {
      const dadosSalvos = await AsyncStorage.getItem('@tutor_clyvo');
      if (dadosSalvos) {
        const tutor = JSON.parse(dadosSalvos);
        setTutorId(tutor.id || tutor.user_id);
      }
    };
    buscarIdLocal();
  }, []);

  // 2. Busca os medicamentos no Back-end
  // Adapte a rota '/medicamentos' caso o seu Java utilize uma rota diferente, como '/tutores/{id}/medicamentos'
  const { data: medicamentos, isLoading, isError } = useQuery({
    queryKey: ['meus-medicamentos', tutorId],
    queryFn: async () => {
      const response = await api.get('/medicamentos'); 
      return response.data;
    },
    enabled: !!tutorId, // Só roda a query quando tiver o ID do tutor
  });

  // Função para renderizar a tela verde vazia (quando não houver dados)
  const renderEmptyState = () => (
    <View style={styles.emptyCard}>
      <MaterialCommunityIcons name="medical-bag" size={60} color={colors.verdeClaro} style={{ marginBottom: 15 }} />
      <Text style={styles.emptyTitle}>Nenhum tratamento ativo</Text>
      <Text style={styles.emptyText}>
        Você ainda não possui tratamentos ou pets cadastrados. Cadastre seu pet para gerenciar os medicamentos e laudos médicos!
      </Text>
      <TouchableOpacity 
        style={styles.botaoCadastrarPet}
        onPress={() => navigation.navigate('PetForm')} // Ajuste para o nome real da sua rota de cadastro de pet
      >
        <Text style={styles.textoBotaoCadastrar}>CADASTRAR PET</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>MEUS MEDICAMENTOS</Text>
          <Text style={styles.subtitulo}>ACOMPANHE O TRATAMENTO DO SEU PET</Text>
        </View>
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.verdeEscuro} />
          <Text style={{ marginTop: 10, color: colors.cinza, fontWeight: 'bold' }}>Buscando tratamentos...</Text>
        </View>
      ) : isError || !medicamentos || !medicamentos.content || medicamentos.content.length === 0 ? (
        /* Renderiza a tela verde se não houver dados ou der erro na rota */
        renderEmptyState()
      ) : (
        /* Renderiza a lista de medicamentos vindos do banco de dados */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         
          {medicamentos.content.map((med: any, index: number) => (
            <View key={med.id || index} style={styles.medCard}>
              
              <View style={styles.medHeader}>
                <View style={styles.nomeContainer}>
                  <MaterialCommunityIcons name="pill" size={24} color={colors.roxoMuitoEscuro} />
                  <Text style={styles.medNome}>{med.nome}</Text>
                </View>
                
                {/* Lógica para a cor do Status baseado na sua tabela do banco (EM_DIA ou CONCLUIDO) */}
                <View style={[styles.badgeStatus, { backgroundColor: med.status === 'CONCLUIDO' ? '#D3D3D3' : colors.verdeClaro }]}>
                  <Text style={[styles.textoStatus, { color: med.status === 'CONCLUIDO' ? '#666' : colors.roxoMuitoEscuro }]}>
                    {med.status === 'CONCLUIDO' ? 'CONCLUÍDO' : 'EM DIA'}
                  </Text>
                </View>
              </View>

              <Text style={styles.petNome}>
                🐾 Pet: {med.consulta?.nomePet || 'Nome não identificado'}
              </Text>

              <View style={styles.medDetalhes}>
                <View style={styles.detalheItem}>
                  <Text style={styles.detalheLabel}>Dosagem:</Text>
                  <Text style={styles.detalheValor}>{med.dosagem}</Text>
                </View>
                <View style={styles.detalheItem}>
                  <Text style={styles.detalheLabel}>Frequência:</Text>
                  <Text style={styles.detalheValor}>{med.frequencia}</Text>
                </View>
                <View style={styles.detalheItem}>
                  <Text style={styles.detalheLabel}>Duração:</Text>
                  <Text style={styles.detalheValor}>{med.duracaoDias} dias</Text>
                </View>
                <View style={styles.detalheItem}>
                  <Text style={styles.detalheLabel}>Início:</Text>
                  <Text style={styles.detalheValor}>{med.dataInicio}</Text>
                </View>
              </View>
              
            </View>
          ))}
        </ScrollView>
      )}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.verdeMedio,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /* ESTILOS DA TELA VERDE (EMPTY STATE) */
  emptyCard: {
    backgroundColor: colors.verdeMedio, // Ajuste para o tom exato do seu print
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    color: colors.branco,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.branco,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  botaoCadastrarPet: {
    backgroundColor: colors.verdeClaro,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  textoBotaoCadastrar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 16,
  },

  /* ESTILOS DOS CARTÕES DE MEDICAMENTO */
  medCard: {
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    backgroundColor: colors.branco,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medNome: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginLeft: 8,
  },
  badgeStatus: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  textoStatus: {
    fontSize: 10,
    fontWeight: '900',
  },
  petNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.verdeEscuro,
    marginBottom: 10,
  },
  medDetalhes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detalheItem: {
    width: '48%',
    marginBottom: 10,
  },
  detalheLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.cinza,
  },
  detalheValor: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
});