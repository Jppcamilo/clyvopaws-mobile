import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, Appearance, View } from 'react-native';
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { coresClaras, coresEscuras, type CoresTema, type ModoTema } from './colors';
import { temaService } from '../services/temaService';

type ContextoTema = {
  modo: ModoTema;
  colors: CoresTema;
  temaNavegacao: Theme;
  erroTema: string | null;
  alterarTema: (modo: ModoTema) => Promise<void>;
};

const TemaContext = createContext<ContextoTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const [modo, setModo] = useState<ModoTema>(() =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );
  const [pronto, setPronto] = useState(false);
  const [erroTema, setErroTema] = useState<string | null>(null);
  const versao = useRef(0);
  const colors = modo === 'dark' ? coresEscuras : coresClaras;

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = await temaService.carregar();
        if (ativo && salvo) setModo(salvo);
      } catch {
        if (ativo) setErroTema('Não foi possível recuperar o tema salvo.');
      } finally {
        if (ativo) setPronto(true);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    Appearance.setColorScheme(modo);
    void SystemUI.setBackgroundColorAsync(colors.superficie).catch(() => {
      console.warn('Não foi possível atualizar o fundo nativo do aplicativo.');
    });
  }, [modo, pronto, colors.superficie]);

  const alterarTema = useCallback(async (novoModo: ModoTema) => {
    const atual = ++versao.current;
    setModo(novoModo);
    setErroTema(null);
    try {
      await temaService.salvar(novoModo);
    } catch {
      if (atual === versao.current) {
        setErroTema('O tema foi aplicado, mas não pôde ser salvo. Tente selecionar novamente.');
      }
    }
  }, []);

  const temaNavegacao = useMemo<Theme>(() => {
    const base = modo === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.destaque,
        background: colors.fundo,
        card: colors.superficie,
        text: colors.roxoMuitoEscuro,
        border: colors.borda,
        notification: colors.erro,
      },
    };
  }, [modo, colors]);

  const valor = useMemo(() => ({
    modo, colors, temaNavegacao, erroTema, alterarTema,
  }), [modo, colors, temaNavegacao, erroTema, alterarTema]);

  return (
    <TemaContext.Provider value={valor}>
      {pronto ? children : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.superficie }}>
          <StatusBar style={modo === 'dark' ? 'light' : 'dark'} />
          <ActivityIndicator size="large" color={colors.destaque} />
        </View>
      )}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) throw new Error('useTema deve ser usado dentro de TemaProvider.');
  return contexto;
}
