import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import { TemaProvider, useTema } from './src/theme/TemaProvider';
import { useSessaoApp } from './src/hooks/useSessaoApp';
import { useNotificacoesConsulta } from './src/hooks/useNotificacoesConsultas';
import { configurarCanalConsultas } from './src/services/notificacaoService';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import PetFormScreen from './src/screens/PetFormScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PetsScreen from './src/screens/PetsScreen';
import PetDetailsScreen from './src/screens/PetDetailsScreen';
import ConsultasScreen from './src/screens/ConsultaScreen';
import RedeClinicaScreen from './src/screens/RedeClinicaScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import ProductDetailsScreen from './src/screens/ProductDetailScreen';
import MeusMedicamentosScreen from './src/screens/MeusMedicamentosScreen';
import AjudaScreen from './src/screens/AjudaScreen';
import EnderecosScreen from './src/screens/EnderecosScreen';
import ContatosScreen from './src/screens/ContatosScreen';
import ChatScreen from './src/screens/ChatScreen';
import InfoRacaScreen from './src/screens/InfoRacaScreen';
import SobreScreen from './src/screens/SobreScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function TabNavigator() {
  const { colors } = useTema();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.destaque,
        tabBarInactiveTintColor: colors.cinza,

        tabBarStyle: {
          height: 100,
          paddingBottom: 30,
          paddingTop: 10,
          backgroundColor: colors.superficie,
          borderTopWidth: 1,
          borderTopColor: colors.borda,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
          marginTop: 2,
        },

        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap =
            'home';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Servicos') {
            iconName = 'view-grid-outline';
          } else if (route.name === 'Ajuda') {
            iconName = 'help-circle-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={30}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'HOME' }}
      />
      <Tab.Screen
        name="Servicos"
        component={ServicesScreen}
        options={{ tabBarLabel: 'SERVIÇOS' }}
      />
      <Tab.Screen
        name="Ajuda"
        component={AjudaScreen}
        options={{ tabBarLabel: 'AJUDA' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return <TemaProvider><AppConteudo /></TemaProvider>;
}

function AppConteudo() {
  const { colors, modo, temaNavegacao } = useTema();
  const { sessao, erro, tentarNovamente } = useSessaoApp();
  const { navigationRef, processarPendente } = useNotificacoesConsulta(sessao.token, sessao.tutor?.id);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (tentativas, falha) => {
              if (axios.isCancel(falha)) return false;

              if (
                axios.isAxiosError(falha) &&
                [401, 403].includes(falha.response?.status ?? 0)
              ) {
                return false;
              }

              return tentativas < 1;
            },
          },
        },
      }),
    [sessao.geracao],
  );

  useEffect(() => {
    return () => {
      void queryClient.cancelQueries();
      queryClient.clear();
    };
  }, [queryClient]);

  useEffect(() => {
    void configurarCanalConsultas().catch(() => {
      Alert.alert('Notificações', 'Não foi possível configurar os lembretes neste aparelho.');
    });
  }, []);

  if (!sessao.inicializada) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          backgroundColor: colors.superficie,
        }}
      >
        <StatusBar style={modo === "dark" ? "light" : "dark"} />

        {erro ? (
          <>
            <Text style={{ textAlign: 'center', color: colors.roxoMuitoEscuro }}>{erro}</Text>

            <TouchableOpacity
              onPress={() => {
                void tentarNovamente();
              }}
              style={{ padding: 20 }}
            >
              <Text style={{ color: colors.destaque }}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator
            size="large"
            color={colors.destaque}
          />
        )}
      </View>
    );
  }

  const autenticado = !!sessao.token && !!sessao.tutor;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={modo === "dark" ? "light" : "dark"} />

      <NavigationContainer
        theme={temaNavegacao}
        ref={navigationRef}
        onReady={processarPendente}
        onStateChange={processarPendente}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {autenticado ? (
            <Stack.Group navigationKey={`privado-${sessao.geracao}`}>
              <Stack.Screen name="MainTabs" component={TabNavigator} />
              <Stack.Screen name="PetForm" component={PetFormScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Pets" component={PetsScreen} />
              <Stack.Screen
                name="PetDetails"
                component={PetDetailsScreen}
              />
              <Stack.Screen name="Consultas" component={ConsultasScreen} />
              <Stack.Screen
                name="RedeClinica"
                component={RedeClinicaScreen}
              />
              <Stack.Screen name="Produtos" component={ProdutosScreen} />
              <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
              />
              <Stack.Screen
                name="MeusMedicamentos"
                component={MeusMedicamentosScreen}
              />
              <Stack.Screen name="Enderecos" component={EnderecosScreen} />
              <Stack.Screen name="Contatos" component={ContatosScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="InfoRaca" component={InfoRacaScreen} />
              <Stack.Screen name="Sobre" component={SobreScreen} />
            </Stack.Group>
          ) : (
            <Stack.Group navigationKey="publico">
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
