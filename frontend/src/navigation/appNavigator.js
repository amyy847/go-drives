import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import AdminDashboard from '../screens/Admin/DashboardScreen';
import CameraScreen from '../screens/Camera/CameraScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
