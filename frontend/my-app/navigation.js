import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import adminDashboard from './screens/adminDashboard';
import carDashboard from './screens/carDashboard';
import userHomeScreen from './screens/userHomeScreen';
import CameraViews from './screens/CameraViews';
import LidarData from './screens/LidarData';
import RadarData from './screens/RadarData';
import MapScreen from './screens/MapScreen';
import PassengerData from './screens/PassengerData';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminDashboard" component={adminDashboard} />
        <Stack.Screen name="CarDashboard" component={carDashboard} />
        <Stack.Screen name="UserHomeScreen" component={userHomeScreen} />
        <Stack.Screen name="CameraViews" component={CameraViews} />
        <Stack.Screen name="LidarData" component={LidarData} />
        <Stack.Screen name="RadarData" component={RadarData} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="PassengerData" component={PassengerData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
