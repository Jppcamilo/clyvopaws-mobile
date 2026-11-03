import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCarrinho } from '../hooks/useCarrinho';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { formatarMoeda } from '../services/carrinhoService';
import SeletorQuantidade from '../components/SeletorQuantidade';
import type { CoresTema } from '../theme/colors';

export default function CarrinhoScreen() {
  const { colors, styles } = useEstilosTema(criarEstilos);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { linhas, quantidadeTotal, total, carregando, salvando, erro, indisponivel,
    definirQuantidade, remover, esvaziar, tentarNovamente } = useCarrinho();

  const confirmarLimpeza = () => Alert.alert('Esvaziar carrinho?', 'Os produtos salvos neste carrinho serão removidos.', [
    { text: 'Manter produtos', style: 'cancel' },
    { text: 'Esvaziar', style: 'destructive', onPress: () => { void esvaziar(); } },
  ]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.icone} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <View style={styles.titulos}>
          <Text style={styles.sobretitulo}>CLYVOPAWS • CATÁLOGO</Text>
          <Text style={styles.titulo}>Meu carrinho</Text>
        </View>
      </View>

      {carregando ? (
        <View style={styles.estado}><ActivityIndicator size="large" color={colors.destaque} /><Text style={styles.descricao}>Abrindo seu carrinho…</Text></View>
      ) : erro ? (
        <View style={styles.estado}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.destaque} />
          <Text style={styles.tituloEstado}>Vamos tentar novamente?</Text>
          <Text style={styles.descricao}>{erro}</Text>
          <TouchableOpacity style={styles.primario} onPress={tentarNovamente} disabled={salvando} accessibilityRole="button"><Text style={styles.textoPrimario}>Tentar novamente</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secundario} onPress={confirmarLimpeza} disabled={salvando} accessibilityRole="button"><Text style={styles.textoLink}>Esvaziar e recomeçar</Text></TouchableOpacity>
        </View>
      ) : linhas.length === 0 ? (
        <View style={styles.estado}>
          <View style={styles.circulo}><MaterialCommunityIcons name="cart-outline" size={54} color={colors.destaque} /></View>
          <Text style={styles.tituloEstado}>Um carinho para o seu pet</Text>
          <Text style={styles.descricao}>Seu carrinho está vazio. Explore o catálogo e guarde os produtos que chamarem sua atenção.</Text>
          <TouchableOpacity style={styles.primario} onPress={() => navigation.navigate('Produtos')} accessibilityRole="button"><Text style={styles.textoPrimario}>Explorar produtos</Text></TouchableOpacity>
          <Text style={styles.legenda}>Carrinho demonstrativo, sem compras reais.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={linhas}
            keyExtractor={item => item.produtoId}
            contentContainerStyle={styles.lista}
            ListHeaderComponent={
              <View>
                <View style={styles.aviso}>
                  <MaterialCommunityIcons name="information-outline" size={22} color={colors.destaque} />
                  <Text style={styles.textoAviso}>Monte sua lista e confira os valores ilustrativos. Este carrinho não gera pedidos, pagamentos ou entregas.</Text>
                </View>
                <View style={styles.linhaResumo}>
                  <Text style={styles.contagem}>{quantidadeTotal} {quantidadeTotal === 1 ? 'item selecionado' : 'itens selecionados'}</Text>
                  <TouchableOpacity style={styles.limpar} onPress={confirmarLimpeza} disabled={indisponivel} accessibilityRole="button"><Text style={styles.textoLink}>Esvaziar</Text></TouchableOpacity>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.linhaProduto}>
                  <View style={styles.fundoImagem}><Image source={item.produto.imagem} resizeMode="contain" style={styles.imagem} /></View>
                  <View style={styles.dados}>
                    <Text style={styles.categoria}>{item.produto.categoria}</Text>
                    <Text style={styles.nome}>{item.produto.nome}</Text>
                    <Text style={styles.unitario}>{formatarMoeda(item.precoUnitario)} / un.</Text>
                  </View>
                  <TouchableOpacity style={styles.remover} disabled={indisponivel} onPress={() => { void remover(item.produtoId); }}
                    accessibilityRole="button" accessibilityLabel={`Remover ${item.produto.nome}`} accessibilityState={{ disabled: indisponivel }}>
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.cinza} />
                  </TouchableOpacity>
                </View>
                <View style={styles.rodapeCard}>
                  <SeletorQuantidade quantidade={item.quantidade} nome={item.produto.nome} desabilitado={indisponivel}
                    onChange={valor => { void definirQuantidade(item.produtoId, valor); }} />
                  <Text style={styles.subtotal}>{formatarMoeda(item.subtotal)}</Text>
                </View>
              </View>
            )}
            ListFooterComponent={<Text style={styles.legenda}>Seus itens ficam salvos nesta conta, neste aparelho.</Text>}
          />
          <View style={[styles.resumo, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.linhaResumo}>
              <Text style={styles.contagem}>Total estimado</Text>
              <Text style={styles.total} accessibilityLiveRegion="polite">{formatarMoeda(total)}</Text>
            </View>
            {salvando && <View style={styles.salvando}><ActivityIndicator size="small" color={colors.destaque} /><Text style={styles.textoAviso}>Salvando alteração…</Text></View>}
            <TouchableOpacity style={styles.primario} onPress={() => navigation.navigate('Produtos')} accessibilityRole="button">
              <Text style={styles.textoPrimario}>Continuar explorando</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={colors.textoSobreVerde} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  icone: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.verdeClaro, justifyContent: 'center', alignItems: 'center' },
  titulos: { flex: 1 },
  sobretitulo: { color: colors.destaque, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  titulo: { color: colors.roxoMuitoEscuro, fontSize: 26, fontWeight: '900', marginTop: 4 },
  lista: { paddingHorizontal: 20, paddingBottom: 20 },
  aviso: { flexDirection: 'row', gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.verdeClaro, alignItems: 'center' },
  textoAviso: { flex: 1, color: colors.roxoMuitoEscuro, fontSize: 12, lineHeight: 18 },
  linhaResumo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  contagem: { color: colors.cinza, fontWeight: '600', fontSize: 14 },
  limpar: { paddingVertical: 16, paddingLeft: 12, minHeight: 48 },
  textoLink: { color: colors.destaque, fontWeight: '800', fontSize: 13 },
  card: { padding: 14, backgroundColor: colors.superficie, borderRadius: 22, borderWidth: 1, borderColor: colors.borda, marginBottom: 14 },
  linhaProduto: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  fundoImagem: { width: 72, height: 84, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 6, alignItems: 'center', justifyContent: 'center' },
  imagem: { width: '100%', height: '100%' },
  dados: { flex: 1 },
  categoria: { color: colors.destaque, fontWeight: '800', fontSize: 10, marginBottom: 5 },
  nome: { color: colors.roxoMuitoEscuro, fontWeight: '700', fontSize: 14, lineHeight: 20 },
  unitario: { color: colors.cinza, fontSize: 12, marginTop: 6 },
  remover: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  rodapeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 },
  subtotal: { color: colors.destaque, fontSize: 18, fontWeight: '900' },
  resumo: { padding: 20, borderTopWidth: 1, borderColor: colors.borda, backgroundColor: colors.superficie, gap: 14 },
  total: { color: colors.roxoMuitoEscuro, fontSize: 28, fontWeight: '900' },
  primario: { minHeight: 52, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 18, backgroundColor: colors.verdeEscuro, flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center' },
  textoPrimario: { color: colors.textoSobreVerde, fontSize: 15, fontWeight: '800' },
  estado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 20 },
  circulo: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  tituloEstado: { color: colors.roxoMuitoEscuro, fontSize: 23, fontWeight: '900', textAlign: 'center' },
  descricao: { color: colors.cinza, fontSize: 15, lineHeight: 23, textAlign: 'center' },
  legenda: { color: colors.cinza, fontSize: 12, lineHeight: 18, textAlign: 'center', paddingVertical: 12 },
  secundario: { padding: 16 },
  salvando: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
