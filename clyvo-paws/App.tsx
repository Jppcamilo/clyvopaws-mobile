import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';


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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.verdeEscuro, 
        tabBarInactiveTintColor: colors.cinza,
        tabBarStyle: { height: 90, paddingBottom: 20, paddingTop: 10, backgroundColor: colors.branco, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '900', marginTop: 4 },
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Servicos') iconName = 'view-grid-outline';
          else if (route.name === 'Ajuda') iconName = 'help-circle-outline';
          return <MaterialCommunityIcons name={iconName} size={34} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'HOME' }} />
      <Tab.Screen name="Servicos" component={ServicesScreen} options={{ tabBarLabel: 'SERVIÇOS' }} />
      <Tab.Screen name="Ajuda" component={() => null} options={{ tabBarLabel: 'AJUDA' }} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="PetForm" component={PetFormScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Pets" component={PetsScreen} />
        <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
        <Stack.Screen name="Consultas" component={ConsultasScreen} />
        <Stack.Screen name="RedeClinica" component={RedeClinicaScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}