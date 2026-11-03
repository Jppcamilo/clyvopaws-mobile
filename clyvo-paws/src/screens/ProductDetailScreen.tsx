import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import type { RouteProp } from '@react-navigation/native';
import { catalogoService } from '../services/catalogoService';
 
export default function ProductDetailsScreen() {
  const { colors, styles } = useEstilosTema(criarEstilos);
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

  return (
    <View style={styles.containerPrincipal}>
     
      <TouchableOpacity style={styles.botaoVoltarFlutuante} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar ao catálogo">
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
      </TouchableOpacity>
 
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
              <Text style={styles.tituloBeneficio}>Catálogo informativo</Text>
              <Text style={styles.subtituloBeneficio}>Valores ilustrativos. Não realizamos pedidos, pagamentos ou entregas pelo aplicativo.</Text>
            </View>
          </View>
 
          <Text style={styles.tituloSecao}>DESCRIÇÃO</Text>
          <Text style={styles.textoDescricao}>
            Consulte as informações do fabricante sobre composição, apresentação e modo de uso.
            Para medicamentos e suplementos, procure orientação do médico veterinário.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
 

    </View>
  );
}
 
const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  containerPrincipal: {
     flex: 1, 
    backgroundColor: colors.superficie },
  botaoVoltarFlutuante: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10, 
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
    height: 350, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingTop: 50 },
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
