import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { Produto } from '../types';

import { useCatalogo } from '../hooks/useCatalogo';

export default function ProdutosScreen() {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const navigation = useNavigation<any>();
  const {
    busca, setBusca, categoria, setCategoria, categorias,
    secoes, quantidade, limparFiltros,
  } = useCatalogo();

  const renderProduto = (produto: Produto) => (
    <TouchableOpacity 
      key={produto.id} 
      style={styles.cardProduto} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetails', { produtoId: produto.id })}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${produto.nome}`}
    >
      <Image source={produto.imagem} style={styles.imagemProduto} resizeMode="contain" />
      <Text style={styles.nomeProduto} numberOfLines={2}>{produto.nome}</Text>
      
      {produto.precoAntigo && (
        <Text style={styles.precoAntigo}>{produto.precoAntigo}</Text>
      )}
      
      <Text style={styles.precoNovo}>{produto.precoNovo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.containerPrincipal}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar">
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titulo}>CATÁLOGO DE PRODUTOS</Text>
        <Text style={styles.avisoCatalogo}>
          Consulte os produtos e seus detalhes. Valores ilustrativos; não realizamos vendas pelo aplicativo.
        </Text>

        <View style={styles.containerBusca}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeBusca} />
          <TextInput keyboardAppearance={modo} 
            style={styles.inputBusca}
            placeholder="Buscar produto"
            accessibilityLabel="Buscar produto pelo nome"
            autoCorrect={false}
            placeholderTextColor={colors.cinza}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.faixaCategorias}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollCategorias}>
            {categorias.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.itemCategoria, categoria === cat && styles.categoriaSelecionada]}
                onPress={() => setCategoria(cat)}
                accessibilityRole="button"
                accessibilityLabel={cat === 'TODOS' ? 'Todas as categorias' : `Filtrar por ${cat}`}
                accessibilityState={{ selected: categoria === cat }}
              >
                <Text style={[styles.textoCategoria, categoria === cat && styles.textoCategoriaSelecionada]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.resultados} accessibilityLiveRegion="polite">
          {quantidade} {quantidade === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </Text>

        {secoes.map(secao => (
          <View key={secao.titulo}>
            <Text style={styles.tituloSecao}>{secao.titulo}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollProdutos}>
              {secao.produtos.map(renderProduto)}
            </ScrollView>
          </View>
        ))}

        {quantidade === 0 && (
          <View style={styles.vazio}>
            <MaterialCommunityIcons name="magnify" size={36} color={colors.destaque} />
            <Text style={styles.tituloVazio}>Nenhum produto encontrado</Text>
            <Text style={styles.textoVazio}>Tente outro nome ou selecione outra categoria.</Text>
            <TouchableOpacity style={styles.limpar} onPress={limparFiltros} accessibilityRole="button">
              <Text style={styles.textoLimpar}>LIMPAR FILTROS</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  containerPrincipal: { 
    flex: 1, 
    backgroundColor: colors.superficie },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    marginBottom: 20, 
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
    paddingHorizontal: 20, 
    marginBottom: 15 },
  containerBusca: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: colors.borda, 
    borderWidth: 1, 
    borderRadius: 25, 
    height: 45, 
    marginHorizontal: 20, 
    paddingHorizontal: 15, 
    marginBottom: 25 },
  iconeBusca: { 
    marginRight: 10 },
  inputBusca: { 
    flex: 1, 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold', 
    fontSize: 14 },
  faixaCategorias: { 
    backgroundColor: colors.verdeEscuro, 
    paddingVertical: 12, 
    marginBottom: 30 },
  scrollCategorias: { 
    paddingHorizontal: 15 },
  itemCategoria: {
    marginHorizontal: 5,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent' },
  categoriaSelecionada: {
    borderColor: colors.textoSobreVerde,
    backgroundColor: colors.superficie },
  textoCategoriaSelecionada: { color: colors.destaque },
  avisoCatalogo: {
    marginHorizontal: 20, marginBottom: 20,
    color: colors.cinza, fontSize: 13, lineHeight: 20 },
  resultados: {
    marginHorizontal: 20, marginBottom: 20,
    color: colors.cinza, fontSize: 13 },
  vazio: { alignItems: 'center', padding: 24 },
  tituloVazio: { color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 18, marginTop: 12 },
  textoVazio: { color: colors.cinza, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  limpar: { backgroundColor: colors.verdeEscuro, padding: 16, borderRadius: 24, marginTop: 20 },
  textoLimpar: { color: colors.textoSobreVerde, fontWeight: 'bold' },
  textoCategoria: { 
    color: colors.textoSobreVerde, 
    fontWeight: '900', 
    fontSize: 12 },
  tituloSecao: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    paddingHorizontal: 20, 
    marginBottom: 15, 
    textTransform: 'uppercase' },
  scrollProdutos: { 
    paddingHorizontal: 15, 
    marginBottom: 35 },
  cardProduto: { 
    width: 130, 
    borderColor: colors.verdeMedio, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 10, 
    marginHorizontal: 5, 
    backgroundColor: colors.superficie },
  imagemProduto: { 
    width: '100%', 
    height: 80, 
    marginBottom: 10 },
  nomeProduto: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5, 
    lineHeight: 12 },
  precoAntigo: { 
    fontSize: 10, 
    color: colors.cinza, 
    textDecorationLine: 'line-through', 
    fontWeight: 'bold' },
  precoNovo: { 
    fontSize: 14, 
    color: colors.destaque, 
    fontWeight: '900' }
});
