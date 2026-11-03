import { useMemo, useState } from 'react';
import { catalogoService } from '../services/catalogoService';

export function useCatalogo() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('TODOS');
  const secoes = useMemo(
    () => catalogoService.filtrar(busca, categoria),
    [busca, categoria],
  );
  const limparFiltros = () => {
    setBusca('');
    setCategoria('TODOS');
  };
  return {
    busca, setBusca, categoria, setCategoria,
    categorias: catalogoService.categorias,
    secoes, limparFiltros,
    quantidade: secoes.reduce((total, secao) => total + secao.produtos.length, 0),
  };
}
