import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';

import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import PetFormScreen from './src/screens/PetFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.verdeEscuro, 
        tabBarInactiveTintColor: colors.cinza,
        tabBarStyle: { height: 90, paddingBottom: 20, paddingTop: 10, backgroundColor: colors.branco },
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        <Stack.Screen name="PetForm" component={PetFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}