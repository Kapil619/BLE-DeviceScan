// App.tsx
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BLEScanner from './src/screens/BLEScanner';
import PeripheralDetailsScreen from './src/screens/PeripheralDetails';
import {StatusBar} from 'react-native';
import Chart from './src/screens/Chart';

export type RootStackParamList = {
  BLEScanner: undefined;
  PeripheralDetailsScreen: {peripheralData: any};
  Chart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
          initialRouteName="BLEScanner">
          <Stack.Screen name="BLEScanner" component={BLEScanner} />
          <Stack.Screen
            name="PeripheralDetailsScreen"
            component={PeripheralDetailsScreen}
          />
          <Stack.Screen name="Chart" component={Chart} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
