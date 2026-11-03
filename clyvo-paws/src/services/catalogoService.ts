import { PROMOCOES, REMEDIOS, COSMETICOS } from '../data/produtos';
import type { Produto } from '../types';

const secoes = [
  { titulo: 'PROMOÇÕES', produtos: PROMOCOES },
  { titulo: 'REMÉDIOS', produtos: REMEDIOS },
  { titulo: 'COSMÉTICOS', produtos: COSMETICOS },
];
const produtos = secoes.flatMap(secao => secao.produtos);

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export const catalogoService = {
  categorias: ['TODOS', ...Array.from(new Set(produtos.map(produto => produto.categoria)))],

  buscarPorId(id?: string): Produto | undefined {
    return produtos.find(produto => produto.id === id);
  },

  filtrar(busca: string, categoria: string) {
    const termo = normalizar(busca);
    return secoes.map(secao => ({
      titulo: secao.titulo,
      produtos: secao.produtos.filter(produto =>
        (categoria === 'TODOS' || produto.categoria === categoria) &&
        normalizar(produto.nome).includes(termo),
      ),
    })).filter(secao => secao.produtos.length > 0);
  },
};
