import AsyncStorage from '@react-native-async-storage/async-storage';
import { catalogoService } from './catalogoService';

export type ItemCarrinho = { produtoId: string; quantidade: number };
export const LIMITE_QUANTIDADE = 99;

export function precoEmCentavos(preco: string): number {
  const valor = preco.replace(/R\$|\s/g, '');
  if (!/^(\d+|\d{1,3}(\.\d{3})+),\d{2}$/.test(valor)) {
    throw new Error('Preço indisponível para este produto.');
  }
  const centavos = Number(valor.replace(/\./g, '').replace(',', ''));
  if (!Number.isSafeInteger(centavos) || centavos < 0) throw new Error('Preço inválido.');
  return centavos;
}

export function formatarMoeda(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function chave(tutorId: number) {
  if (!Number.isSafeInteger(tutorId) || tutorId <= 0) throw new Error('Entre na sua conta para usar o carrinho.');
  return `@clyvopaws/carrinho/v1/${tutorId}`;
}

export function validarItens(valor: unknown): ItemCarrinho[] {
  if (!Array.isArray(valor)) throw new Error('Carrinho salvo inválido.');
  const ids = new Set<string>();
  return valor.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Item salvo inválido.');
    const { produtoId, quantidade } = item as Partial<ItemCarrinho>;
    if (typeof produtoId !== 'string' || typeof quantidade !== 'number' ||
        !Number.isInteger(quantidade) || quantidade < 1 || quantidade > LIMITE_QUANTIDADE || ids.has(produtoId)) {
      throw new Error('Item salvo inválido.');
    }
    ids.add(produtoId);
    const produto = catalogoService.buscarPorId(produtoId);
    if (!produto) return [];
    precoEmCentavos(produto.precoNovo);
    return [{ produtoId, quantidade }];
  });
}

export function adicionarItem(itens: ItemCarrinho[], produtoId: string, quantidade = 1): ItemCarrinho[] {
  const produto = catalogoService.buscarPorId(produtoId);
  if (!produto) throw new Error('Produto não encontrado.');
  precoEmCentavos(produto.precoNovo);
  const atual = itens.find(item => item.produtoId === produtoId)?.quantidade ?? 0;
  if (!Number.isInteger(quantidade) || quantidade < 1 || atual + quantidade > LIMITE_QUANTIDADE) {
    throw new Error(`Você pode guardar até ${LIMITE_QUANTIDADE} unidades de cada produto.`);
  }
  return atual
    ? itens.map(item => item.produtoId === produtoId ? { ...item, quantidade: atual + quantidade } : item)
    : [...itens, { produtoId, quantidade }];
}

export function alterarQuantidade(itens: ItemCarrinho[], produtoId: string, quantidade: number): ItemCarrinho[] {
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > LIMITE_QUANTIDADE) {
    throw new Error(`Escolha uma quantidade entre 1 e ${LIMITE_QUANTIDADE}.`);
  }
  return itens.map(item => item.produtoId === produtoId ? { ...item, quantidade } : item);
}

export function resumirCarrinho(itens: ItemCarrinho[]) {
  const linhas = itens.flatMap(item => {
    const produto = catalogoService.buscarPorId(item.produtoId);
    if (!produto) return [];
    const precoUnitario = precoEmCentavos(produto.precoNovo);
    return [{ ...item, produto, precoUnitario, subtotal: precoUnitario * item.quantidade }];
  });
  return {
    linhas,
    quantidadeTotal: linhas.reduce((soma, item) => soma + item.quantidade, 0),
    total: linhas.reduce((soma, item) => soma + item.subtotal, 0),
  };
}

export const carrinhoService = {
  async carregar(tutorId: number): Promise<ItemCarrinho[]> {
    const texto = await AsyncStorage.getItem(chave(tutorId));
    if (!texto) return [];
    const salvo: unknown = JSON.parse(texto);
    if (!salvo || typeof salvo !== 'object' || !('versao' in salvo) || salvo.versao !== 1 || !('itens' in salvo)) {
      throw new Error('Formato do carrinho inválido.');
    }
    return validarItens(salvo.itens);
  },
  async salvar(tutorId: number, itens: ItemCarrinho[]) {
    await AsyncStorage.setItem(chave(tutorId), JSON.stringify({ versao: 1, itens: validarItens(itens) }));
  },
};
