import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { useSobre } from '../hooks/useSobre';
import type { CoresTema } from '../theme/colors';

export default function SobreScreen() {
  const navigation = useNavigation();
  const { colors, styles } = useEstilosTema(criarEstilos);
  const { sobre, versao, commit, estado, abrirRepositorio, abrirCommit } = useSobre();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar para Ajuda"
            style={styles.voltar}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
          <Text style={styles.titulo}>Sobre o aplicativo</Text>
        </View>

        <View style={styles.apresentacao}>
          <View style={styles.icone}>
            <MaterialCommunityIcons name="paw" size={42} color={colors.destaque} />
          </View>
          <Text style={styles.nome}>{sobre.nome}</Text>
          <Text style={styles.descricao}>{sobre.descricao}</Text>
        </View>

        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.tituloCard}>Versão do aplicativo</Text>
          <Text selectable style={styles.versao}>{versao}</Text>
          <Text style={styles.label}>Commit de referência</Text>
          <Text selectable style={styles.hash}>{commit ?? 'Não disponível neste ambiente'}</Text>
          <Text style={styles.textoSecundario}>
            {estado === 'alterado'
              ? 'Desenvolvimento: há alterações locais ainda não registradas neste commit.'
              : estado === 'sem-git'
                ? 'Desenvolvimento: o commit será identificado ao executar o projeto com Git ou gerar a build pelo EAS.'
                : 'Identifica a referência do código usada nesta versão.'}
          </Text>
          {commit && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel="Ver commit de referência no GitHub"
              style={styles.link}
              onPress={() => { void abrirCommit(); }}
            >
              <Text style={styles.textoLink}>Ver commit no GitHub</Text>
              <MaterialCommunityIcons name="open-in-new" size={18} color={colors.destaque} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.tituloCard}>Nossa equipe</Text>
          <Text style={styles.textoSecundario}>{sobre.projeto}</Text>
          {sobre.integrantes.map(integrante => (
            <View key={integrante.rm} style={styles.integrante}>
              <Text style={styles.nomeIntegrante}>{integrante.nome}</Text>
              <Text style={styles.textoSecundario}>RM {integrante.rm}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="Abrir repositório mobile do ClyvoPaws no GitHub"
          style={styles.botao}
          onPress={() => { void abrirRepositorio(); }}
        >
          <MaterialCommunityIcons name="github" size={24} color={colors.textoSobreVerde} />
          <Text style={styles.textoBotao}>Repositório do projeto</Text>
        </TouchableOpacity>
        <Text selectable style={styles.endereco}>{sobre.repositorio}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo },
  conteudo: { padding: 20, paddingBottom: 32 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  voltar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.verdeClaro },
  titulo: { flex: 1, fontSize: 22, fontWeight: '900', color: colors.roxoMuitoEscuro },
  apresentacao: { alignItems: 'center', marginBottom: 24 },
  icone: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.verdeClaro, marginBottom: 12 },
  nome: { color: colors.destaque, fontSize: 28, fontWeight: '900', marginBottom: 12 },
  descricao: { color: colors.roxoMuitoEscuro, fontSize: 15, lineHeight: 23, textAlign: 'center' },
  card: { padding: 20, borderRadius: 18, backgroundColor: colors.superficie, borderColor: colors.borda, borderWidth: 1, marginBottom: 16 },
  tituloCard: { fontSize: 17, fontWeight: '800', color: colors.roxoMuitoEscuro, marginBottom: 10 },
  versao: { fontSize: 24, fontWeight: '800', color: colors.destaque, marginBottom: 16 },
  label: { color: colors.roxoMuitoEscuro, fontWeight: '700', marginBottom: 8 },
  hash: { color: colors.roxoMuitoEscuro, fontSize: 13, lineHeight: 21, marginBottom: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  textoSecundario: { color: colors.cinza, fontSize: 14, lineHeight: 21 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, marginTop: 8, flexWrap: 'wrap' },
  textoLink: { fontSize: 14, color: colors.destaque, fontWeight: '800' },
  integrante: { paddingTop: 16 },
  nomeIntegrante: { color: colors.roxoMuitoEscuro, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  botao: { backgroundColor: colors.verdeEscuro, borderRadius: 16, padding: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  textoBotao: { flexShrink: 1, color: colors.textoSobreVerde, fontSize: 15, fontWeight: '800' },
  endereco: { textAlign: 'center', color: colors.cinza, fontSize: 12, lineHeight: 20, marginTop: 12 },
});
