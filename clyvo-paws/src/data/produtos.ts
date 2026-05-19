import { Produto } from '../types';
 
export const CATEGORIAS = ['CACHORRO', 'GATO', 'PÁSSARO', 'PEIXE', 'ROEDORES'];
 
export const PROMOCOES: Produto[] = [
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
 
export const REMEDIOS: Produto[] = [
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
 
export const COSMETICOS: Produto[] = [
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