import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCarrinho } from '../hooks/useCarrinho';
import BotaoCarrinho from '../components/BotaoCarrinho';
import SeletorQuantidade from '../components/SeletorQuantidade';
import { formatarMoeda, precoEmCentavos, LIMITE_QUANTIDADE } from '../services/carrinhoService';
import { catalogoService } from '../services/catalogoService';
 
export default function ProductDetailsScreen() {
  const { colors, styles } = useEstilosTema(criarEstilos);
  const insets = useSafeAreaInsets();
  const carrinho = useCarrinho();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{
    ProductDetails: { produtoId?: string; produtoCompleto?: { id: string } };
  }, 'ProductDetails'>>();
 
  const produto = catalogoService.buscarPorId(
    route.params?.produtoId ?? route.params?.produtoCompleto?.id,
  );

  if (!produto) {
    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.tituloSecao}>Produto não encontrado</Text>
        <Text style={styles.textoDescricao}>Volte ao catálogo e selecione outro item.</Text>
        <TouchableOpacity
          style={styles.botaoRetornar}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Text style={styles.textoRetornar}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const noCarrinho = carrinho.linhas.find(item => item.produtoId === produto.id)?.quantidade ?? 0;
  const disponivel = LIMITE_QUANTIDADE - noCarrinho;
  const quantidadeSelecionada = Math.min(quantidade, Math.max(1, disponivel));
  const bloqueado = carrinho.indisponivel || disponivel === 0;
  const adicionar = async () => {
    if (await carrinho.adicionar(produto.id, quantidadeSelecionada)) {
      setAdicionado(true);
      setQuantidade(1);
    }
  };

  return (
    <View style={styles.containerPrincipal}>
     
      <View style={[styles.headerDetalhe, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.botaoVoltarFlutuante} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar ao catálogo">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <BotaoCarrinho />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
       
        <View style={styles.containerImagem}>
          <Image source={produto.imagem} style={styles.imagemGrande} resizeMode="contain" />
        </View>
 
        <View style={styles.conteudo}>
          <View style={styles.tagCategoria}>
            <Text style={styles.textoTagCategoria}>{produto.categoria}</Text>
          </View>
 
          <Text style={styles.nomeProduto}>{produto.nome}</Text>
         
          <View style={styles.containerPreco}>
            {produto.precoAntigo && (
              <Text style={styles.precoAntigo}>{produto.precoAntigo}</Text>
            )}
            <Text style={styles.precoNovo}>{produto.precoNovo}</Text>
          </View>
 
          <View style={styles.boxBeneficios}>
            <MaterialCommunityIcons name="information-outline" size={24} color={colors.destaque} />
            <View style={styles.textosBeneficios}>
              <Text style={styles.tituloBeneficio}>Carrinho demonstrativo</Text>
              <Text style={styles.subtituloBeneficio}>Valores ilustrativos. Não realizamos pedidos, pagamentos ou entregas pelo aplicativo.</Text>
            </View>
          </View>
 
          <Text style={styles.tituloSecao}>DESCRIÇÃO</Text>
          <Text style={styles.textoDescricao}>
            Consulte as informações do fabricante sobre composição, apresentação e modo de uso.
            Para medicamentos e suplementos, procure orientação do médico veterinário.
          </Text>
        </View>
        <View style={styles.compra}>
          <View style={styles.linhaQuantidade}>
            <View>
              <Text style={styles.tituloSecao}>QUANTIDADE</Text>
              <Text style={styles.textoDescricao}>{noCarrinho > 0 ? `${noCarrinho} no seu carrinho` : 'Escolha quantas unidades'}</Text>
            </View>
            <SeletorQuantidade quantidade={quantidadeSelecionada} maximo={Math.max(1, disponivel)} desabilitado={bloqueado}
              nome={produto.nome} onChange={valor => { setQuantidade(valor); setAdicionado(false); }} />
          </View>
          <View style={styles.linhaQuantidade}>
            <Text style={styles.textoDescricao}>Subtotal estimado</Text>
            <Text style={styles.subtotal}>{formatarMoeda(precoEmCentavos(produto.precoNovo) * quantidadeSelecionada)}</Text>
          </View>
          <TouchableOpacity style={[styles.adicionar, bloqueado && styles.desabilitado]} disabled={bloqueado}
            onPress={() => { void adicionar(); }} accessibilityRole="button" accessibilityState={{ disabled: bloqueado, busy: carrinho.salvando }}>
            {carrinho.salvando ? <ActivityIndicator color={colors.textoSobreVerde} /> : <MaterialCommunityIcons name="cart-plus" size={23} color={colors.textoSobreVerde} />}
            <Text style={styles.textoAdicionar}>{carrinho.carregando ? 'Abrindo carrinho…' : disponivel === 0 ? 'Limite de 99 unidades' : 'Adicionar ao carrinho'}</Text>
          </TouchableOpacity>
          {carrinho.erro && <Text style={styles.textoDescricao}>Abra o carrinho para recuperar os itens salvos.</Text>}
          {adicionado && <View style={styles.confirmacao} accessibilityLiveRegion="polite">
            <MaterialCommunityIcons name="check-circle-outline" size={22} color={colors.destaque} />
            <Text style={styles.textoConfirmacao}>Produto adicionado ao carrinho!</Text>
          </View>}
          <TouchableOpacity style={styles.verCarrinho} onPress={() => navigation.navigate('Carrinho')} accessibilityRole="button">
            <Text style={styles.textoConfirmacao}>Ver meu carrinho</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.destaque} />
          </TouchableOpacity>
        </View>
        <View style={{ height: Math.max(insets.bottom, 20) }} />
      </ScrollView>
 

    </View>
  );
}
 
const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  headerDetalhe: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  compra: { marginHorizontal: 20, marginTop: 24, padding: 18, borderWidth: 1, borderColor: colors.borda, borderRadius: 22, gap: 18 },
  linhaQuantidade: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  subtotal: { color: colors.destaque, fontWeight: '900', fontSize: 22 },
  adicionar: { minHeight: 54, padding: 14, backgroundColor: colors.verdeEscuro, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  textoAdicionar: { color: colors.textoSobreVerde, fontSize: 15, fontWeight: '800', flexShrink: 1 },
  desabilitado: { opacity: 0.5 },
  confirmacao: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoConfirmacao: { color: colors.destaque, fontSize: 13, fontWeight: '700', flexShrink: 1 },
  verCarrinho: { minHeight: 44, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  containerPrincipal: {
     flex: 1, 
    backgroundColor: colors.superficie },
  botaoVoltarFlutuante: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84 },
  containerImagem: { 
    backgroundColor: colors.superficieSecundaria, 
    width: '100%', 
    height: 270, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingTop: 10 },
  imagemGrande: { 
    width: '80%', 
    height: '80%' },
  conteudo: { 
    paddingHorizontal: 20, 
    paddingTop: 25 },
  tagCategoria: { 
    backgroundColor: colors.verdeClaro, 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 10, 
    marginBottom: 15 },
  textoTagCategoria: { 
    color: colors.roxoMuitoEscuro, 
    fontSize: 10, 
    fontWeight: '900' },
  nomeProduto: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 15, 
    lineHeight: 28 },
  containerPreco: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginBottom: 25 },
  precoAntigo: { 
    fontSize: 16, 
    color: colors.cinza, 
    textDecorationLine: 'line-through', 
    fontWeight: 'bold', 
    marginRight: 10, 
    marginBottom: 2 },
  precoNovo: { 
    fontSize: 28, 
    color: colors.destaque, 
    fontWeight: '900' },
  boxBeneficios: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.verdeClaro, 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 30 },
  textosBeneficios: { 
    marginLeft: 15, 
    flex: 1 },
  tituloBeneficio: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.destaque },
  subtituloBeneficio: { 
    fontSize: 12, 
    color: colors.roxoMuitoEscuro, 
    marginTop: 2 },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 10 },
  textoDescricao: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    lineHeight: 22, 
    fontWeight: '500' },
 
  estadoVazio: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 24, backgroundColor: colors.superficie,
  },
  botaoRetornar: {
    marginTop: 24, padding: 16, borderRadius: 24, backgroundColor: colors.verdeEscuro,
  },
  textoRetornar: { color: colors.textoSobreVerde, fontWeight: 'bold' },
});

