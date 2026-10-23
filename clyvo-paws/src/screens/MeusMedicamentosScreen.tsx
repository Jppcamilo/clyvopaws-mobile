import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useMedicamentos } from '../hooks/useMedicamento';
import { useNavigation } from '@react-navigation/native';

export default function MeusMedicamentosScreen() {
  const {
    medicamentos, isLoading, isFetching, isError, refetch, pagina, anterior, proxima
  } = useMedicamentos();
  const navigation = useNavigation<any>();

  const renderEmptyState = () => (
    <View style={styles.emptyCard}>
      <MaterialCommunityIcons name="medical-bag" size={60} color={colors.verdeClaro} style={{ marginBottom: 15 }} />
      <Text style={styles.emptyTitle}>Nenhum medicamento encontrado</Text>
      <Text style={styles.emptyText}>
        Não há medicamentos nesta página. Os tratamentos prescritos aparecem aqui quando disponíveis.
      </Text>
      <TouchableOpacity 
        style={styles.botaoCadastrarPet}
        onPress={() => navigation.navigate('PetForm')}
      >
        <Text style={styles.textoBotaoCadastrar}>CADASTRAR PET</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>MEUS MEDICAMENTOS</Text>
          <Text style={styles.subtitulo}>ACOMPANHE O TRATAMENTO DO SEU PET</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.verdeEscuro} />
          <Text style={{ marginTop: 10, color: colors.cinza, fontWeight: 'bold' }}>Buscando tratamentos...</Text>
        </View>
      ) : isError ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.roxoMuitoEscuro, textAlign: 'center' }}>Não foi possível carregar os dados.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => { void refetch(); }} style={{ padding: 16 }}>
            <Text style={{ color: colors.verdeEscuro, fontWeight: 'bold' }}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
      ) : !medicamentos || medicamentos.content.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         
          {medicamentos.content.map((med) => (
            <View key={med.id} style={styles.medCard}>
              
              <View style={styles.medHeader}>
                <View style={styles.nomeContainer}>
                  <MaterialCommunityIcons name="pill" size={24} color={colors.roxoMuitoEscuro} />
                  <Text style={styles.medNome}>{med.nome}</Text>
                </View>
                
                <View style={[styles.badgeStatus, { backgroundColor: med.status === 'CONCLUIDO' ? '#D3D3D3' : colors.verdeClaro }]}>
                  <Text style={[styles.textoStatus, { color: med.status === 'CONCLUIDO' ? '#666' : colors.roxoMuitoEscuro }]}>
                    {med.status === 'CONCLUIDO' ? 'CONCLUÍDO' : med.status === 'ATRASADO' ? 'ATRASADO' : 'EM DIA'}
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
                  <Text style={styles.detalheValor}>{med.duracaoDias != null ? `${med.duracaoDias} dias` : 'Não informada'}</Text>
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
      {!isError && medicamentos && medicamentos.totalPages > 1 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, marginBottom: 24 }}>
          <TouchableOpacity onPress={anterior} disabled={isFetching || pagina === 0} style={{ padding: 12, opacity: isFetching || pagina === 0 ? 0.4 : 1 }}>
            <Text style={{ color: colors.roxoMuitoEscuro }}>ANTERIOR</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.roxoMuitoEscuro }}>{pagina + 1} / {medicamentos.totalPages}</Text>
          <TouchableOpacity onPress={proxima} disabled={isFetching || medicamentos.last} style={{ padding: 12, opacity: isFetching || medicamentos.last ? 0.4 : 1 }}>
            <Text style={{ color: colors.roxoMuitoEscuro }}>PRÓXIMA</Text>
          </TouchableOpacity>
        </View>
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
  
  emptyCard: {
    backgroundColor: colors.verdeMedio,
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