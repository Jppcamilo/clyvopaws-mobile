import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';

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
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.verdeEscuro, 
          tabBarInactiveTintColor: colors.cinza,
          
          tabBarStyle: {
            height: 100,
            paddingBottom: 50,
            paddingTop: 10,
            backgroundColor: colors.branco,
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
          },
                    
          tabBarLabelStyle: {
            fontSize: 12, 
            fontWeight: '900',
            marginTop: 4, 
          },
          
          tabBarIcon: ({ color }) => {
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
            const iconSize = 34; 

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Servicos') {
              iconName = 'view-grid-outline'; 
            } else if (route.name === 'Ajuda') {
              iconName = 'help-circle-outline'; 
            }

            return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
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
          component={HelpScreen} 
          options={{ tabBarLabel: 'AJUDA' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}