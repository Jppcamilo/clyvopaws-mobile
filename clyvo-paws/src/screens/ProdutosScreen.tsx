import React, { useState } from 'react';
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
import { colors } from '../theme/colors';
import { Produto } from '../types';

const CATEGORIAS = ['CACHORRO', 'GATO', 'PÁSSARO', 'PEIXE', 'ROEDORES'];

const PROMOCOES: Produto[] = [
  { 
    id: '1', 
    nome: 'Antipulgas e Carrapatos Bravecto para Cães', 
    precoAntigo: 'R$ 210,00', 
    precoNovo: 'R$ 189,90', 
    imagem: require('../../assets/produtos/Bravecto-Antipulgas-E-Carrapatos--Para-Caes-1000-Mg----De-20-A-40-Kg.png'),
    categoria: 'CACHORRO'
  },
  { 
    id: '2', 
    nome: 'Ração Premier Formula Cães Adultos', 
    precoAntigo: 'R$ 199,00', 
    precoNovo: 'R$ 175,50', 
    imagem: require('../../assets/produtos/PremieR-Formula-Caes-Adultos-PGG-Carne-15-kg-Lateral-Fechada.png.webp'),
    categoria: 'CACHORRO'
  },
  { 
    id: '3', 
    nome: 'Tapete Higiênico Super Premium 30 un', 
    precoAntigo: 'R$ 85,00', 
    precoNovo: 'R$ 69,90', 
    imagem: require('../../assets/produtos/61qZbBrwf2L._AC_SL1000_.jpg'),
    categoria: 'CASA'
  },
];

const REMEDIOS: Produto[] = [
  { 
    id: '4', 
    nome: 'Vermífugo Drontal Plus Sabor Carne', 
    precoNovo: 'R$ 39,90', 
    imagem: require('../../assets/produtos/Vermífugo_Bayer_Drontal_Plus_Sabor_Carne_0009_1-10kg-2c.jpg'), 
    categoria: 'CUIDADOS'
  },
  { 
    id: '5', 
    nome: 'Anti-inflamatório Meloxicam 1mg', 
    precoAntigo: 'R$ 25,00', 
    precoNovo: 'R$ 19,95', 
    imagem: require('../../assets/produtos/Meloxinew-1mg.png'), 
    categoria: 'CUIDADOS'
  },
  { 
    id: '6', 
    nome: 'Suplemento Vitamínico Ograx-3', 
    precoNovo: 'R$ 95,00', 
    imagem: require('../../assets/produtos/ograx-1500-2mnxltmijh.webp'), 
    categoria: 'CUIDADOS'
  },
];

const COSMETICOS: Produto[] = [
  { 
    id: '7', 
    nome: 'Shampoo Neutro Pet Society 500ml', 
    precoAntigo: 'R$ 35,00', 
    precoNovo: 'R$ 29,90', 
    imagem: require('../../assets/produtos/Shampoo-Neutro-Beeps-Pet-Society-500ml.png'), 
    categoria: 'BANHO'
  },
  { 
    id: '8', 
    nome: 'Perfume Baby Pet 100ml', 
    precoAntigo: 'R$ 40,00', 
    precoNovo: 'R$ 34,90', 
    imagem: require('../../assets/produtos/41XWTxLYKrL._AC_SL1200_.jpg'), 
    categoria: 'BANHO'
  },
  { 
    id: '9', 
    nome: 'Condicionador Brilho Intenso 500ml', 
    precoNovo: 'R$ 32,50', 
    imagem: require('../../assets/produtos/613wXTWdlTL._AC_SL1000_.jpg'), 
    categoria: 'BANHO'
  },
];

export default function ProdutosScreen() {
  const navigation = useNavigation<any>();
  const [busca, setBusca] = useState('');

  const renderProduto = (produto: Produto) => (
    <TouchableOpacity 
      key={produto.id} 
      style={styles.cardProduto} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetails', { produtoId: produto.id, produtoCompleto: produto })}
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
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titulo}>PRODUTOS</Text>

        <View style={styles.containerBusca}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeBusca} />
          <TextInput 
            style={styles.inputBusca}
            placeholder="BUSCAR NOME"
            placeholderTextColor={colors.cinza}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.faixaCategorias}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollCategorias}>
            {CATEGORIAS.map((cat, index) => (
              <TouchableOpacity key={index} style={styles.itemCategoria}>
                <Text style={styles.textoCategoria}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.tituloSecao}>PROMOÇÕES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollProdutos}>
          {PROMOCOES.map(renderProduto)}
        </ScrollView>

        <Text style={styles.tituloSecao}>REMÉDIOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollProdutos}>
          {REMEDIOS.map(renderProduto)}
        </ScrollView>

        <Text style={styles.tituloSecao}>COSMÉTICOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollProdutos}>
          {COSMETICOS.map(renderProduto)}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: { flex: 1, backgroundColor: colors.branco },
  header: { paddingHorizontal: 20, paddingTop: 50, marginBottom: 20, alignItems: 'flex-start' },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: '900', color: colors.roxoMuitoEscuro, paddingHorizontal: 20, marginBottom: 15 },
  containerBusca: { flexDirection: 'row', alignItems: 'center', borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 25, height: 45, marginHorizontal: 20, paddingHorizontal: 15, marginBottom: 25 },
  iconeBusca: { marginRight: 10 },
  inputBusca: { flex: 1, color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 14 },
  faixaCategorias: { backgroundColor: colors.verdeEscuro, paddingVertical: 12, marginBottom: 30 },
  scrollCategorias: { paddingHorizontal: 15 },
  itemCategoria: { marginHorizontal: 10 },
  textoCategoria: { color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 12 },
  tituloSecao: { fontSize: 18, fontWeight: '900', color: colors.roxoMuitoEscuro, paddingHorizontal: 20, marginBottom: 15, textTransform: 'uppercase' },
  scrollProdutos: { paddingHorizontal: 15, marginBottom: 35 },
  cardProduto: { width: 130, borderColor: colors.verdeMedio, borderWidth: 1, borderRadius: 15, padding: 10, marginHorizontal: 5, backgroundColor: colors.branco },
  imagemProduto: { width: '100%', height: 80, marginBottom: 10 },
  nomeProduto: { fontSize: 10, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 5, lineHeight: 12 },
  precoAntigo: { fontSize: 10, color: colors.cinza, textDecorationLine: 'line-through', fontWeight: 'bold' },
  precoNovo: { fontSize: 14, color: colors.verdeMedio, fontWeight: '900' }
});