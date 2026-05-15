import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';

const Tab = createBottomTabNavigator();

function HelpScreen() {
  return null; 
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2f7a73',
          tabBarInactiveTintColor: '#5a5a5a',
        }}
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
          component={HelpScreen} 
          options={{ tabBarLabel: 'AJUDA' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}