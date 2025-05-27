// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Chart from './src/screens/Chart';
import BLE from './src/screens/BLE';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Chart">
          <Stack.Screen name="Chart" component={Chart} />
          <Stack.Screen name="BLE" component={BLE} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
