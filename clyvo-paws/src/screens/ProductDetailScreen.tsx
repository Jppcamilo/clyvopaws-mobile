import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { Produto } from '../types';
 
export default function ProductDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
 
  const { produtoCompleto } = route.params;
  const produto: Produto = produtoCompleto;
 
  const [quantidade, setQuantidade] = useState(1);
 
  const adicionarAoCarrinho = () => {
    Alert.alert('Sucesso!', `${quantidade}x ${produto.nome} adicionado ao carrinho.`);
    navigation.goBack();
  };
 
  return (
    <View style={styles.containerPrincipal}>
     
      <TouchableOpacity style={styles.botaoVoltarFlutuante} onPress={() => navigation.goBack()}>
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
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={colors.verdeEscuro} />
            <View style={styles.textosBeneficios}>
              <Text style={styles.tituloBeneficio}>Entrega Padrão Clyvo</Text>
              <Text style={styles.subtituloBeneficio}>Receba amanhã no seu endereço.</Text>
            </View>
          </View>
 
          <Text style={styles.tituloSecao}>DESCRIÇÃO</Text>
          <Text style={styles.textoDescricao}>
            Produto de alta qualidade recomendado pelos especialistas da Clyvo VET.
            Garante o bem-estar e a saúde contínua do seu pet. Siga sempre as orientações do seu médico veterinário de confiança.
          </Text>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
 
      <View style={styles.barraInferior}>
       
        <View style={styles.controleQuantidade}>
          <TouchableOpacity
            style={styles.botaoQtd}
            onPress={() => setQuantidade(q => Math.max(1, q - 1))}
          >
            <MaterialCommunityIcons name="minus" size={20} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
          <Text style={styles.textoQtd}>{quantidade}</Text>
          <TouchableOpacity
            style={styles.botaoQtd}
            onPress={() => setQuantidade(q => q + 1)}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>
 
        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarAoCarrinho}>
          <Text style={styles.textoBotaoAdicionar}>ADICIONAR</Text>
        </TouchableOpacity>
 
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  containerPrincipal: {
     flex: 1, 
    backgroundColor: colors.branco },
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
    backgroundColor: '#F8F8F8', 
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
    color: colors.verdeMedio, 
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
    color: colors.verdeEscuro },
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
 
  barraInferior: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: colors.branco, 
    flexDirection: 'row', 
    padding: 20, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderColor: '#EEEEEE', 
    elevation: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5 },
  controleQuantidade: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0', 
    borderRadius: 25, 
    paddingHorizontal: 5, 
    height: 50, 
    marginRight: 15 },
  botaoQtd: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' },
  textoQtd: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.roxoMuitoEscuro, 
    marginHorizontal: 10 },
  botaoAdicionar: { 
    flex: 1, 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 50 },
  textoBotaoAdicionar: { 
    color: colors.branco, 
    fontSize: 16, 
    fontWeight: '900' }
});
 