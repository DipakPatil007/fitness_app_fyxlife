import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from './src/navigation/MainTabs';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import UserInfoScreen from './src/screens/onboarding/UserInfoScreen';
import ConfirmationScreen from './src/screens/onboarding/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboard = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboarded');
        console.log('Onboarded value:', value);
        setOnboarded(value === 'true');
      } catch (e) {
        setOnboarded(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboard();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboarded ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
          </>
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
