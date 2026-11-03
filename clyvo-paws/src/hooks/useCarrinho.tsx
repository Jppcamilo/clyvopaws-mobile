import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { adicionarItem, alterarQuantidade, carrinhoService, resumirCarrinho } from '../services/carrinhoService';
import type { ItemCarrinho } from '../services/carrinhoService';

function useEstadoCarrinho(tutorId: number | null) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const atual = useRef(itens);
  const ocupado = useRef(false);
  const ativo = useRef(false);

  useEffect(() => {
    ativo.current = true;
    return () => { ativo.current = false; };
  }, []);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro(null);
    const tarefa = tutorId === null ? Promise.resolve([]) : carrinhoService.carregar(tutorId);
    void tarefa.then(dados => {
      if (cancelado) return;
      atual.current = dados;
      setItens(dados);
    }).catch(() => {
      if (!cancelado) setErro('Não foi possível abrir o carrinho salvo. Tente novamente ou esvazie para recomeçar.');
    }).finally(() => { if (!cancelado) setCarregando(false); });
    return () => { cancelado = true; };
  }, [tutorId, tentativa]);

  async function atualizar(transformar: (anteriores: ItemCarrinho[]) => ItemCarrinho[], recuperar = false): Promise<boolean> {
    if (tutorId === null || ocupado.current || carregando || (erro && !recuperar)) return false;
    ocupado.current = true;
    setSalvando(true);
    try {
      const proximos = transformar(atual.current);
      await carrinhoService.salvar(tutorId, proximos);
      if (!ativo.current) return false;
      atual.current = proximos;
      setItens(proximos);
      setErro(null);
      return true;
    } catch (falha) {
      if (ativo.current) Alert.alert('Carrinho', falha instanceof Error && /unidades|quantidade|Produto|Preço/.test(falha.message)
        ? falha.message : 'Não foi possível salvar a alteração no aparelho. Tente novamente.');
      return false;
    } finally {
      ocupado.current = false;
      if (ativo.current) setSalvando(false);
    }
  }

  const resumo = useMemo(() => resumirCarrinho(itens), [itens]);
  return {
    ...resumo, carregando, salvando, erro,
    indisponivel: tutorId === null || carregando || salvando || !!erro,
    adicionar: (id: string, quantidade = 1) => atualizar(anteriores => adicionarItem(anteriores, id, quantidade)),
    definirQuantidade: (id: string, quantidade: number) => atualizar(anteriores => alterarQuantidade(anteriores, id, quantidade)),
    remover: (id: string) => atualizar(anteriores => anteriores.filter(item => item.produtoId !== id)),
    esvaziar: () => atualizar(() => [], true),
    tentarNovamente: () => { if (!ocupado.current) setTentativa(valor => valor + 1); },
  };
}

const CarrinhoContext = createContext<ReturnType<typeof useEstadoCarrinho> | null>(null);

export function CarrinhoProvider({ tutorId, children }: { tutorId: number | null; children: React.ReactNode }) {
  const estado = useEstadoCarrinho(tutorId);
  return <CarrinhoContext.Provider value={estado}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const estado = useContext(CarrinhoContext);
  if (!estado) throw new Error('useCarrinho precisa do CarrinhoProvider.');
  return estado;
}
