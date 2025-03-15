import React from 'react';
import { View, Text, Button } from 'react-native';

const CarDashboard = ({ navigation }) => {
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Car Dashboard</Text>
      <Button title="Lidar Data" onPress={() => navigation.navigate('LidarData')} />
      <Button title="Car Data" onPress={() => navigation.navigate('CarData')} />
      <Button title="Radar Data" onPress={() => navigation.navigate('RadarData')} />
      <Button title="Passenger Data" onPress={() => navigation.navigate('PassengerData')} />
      <Button title="Camera Views" onPress={() => navigation.navigate('CameraViews')} />
      <Button title="Map Screen" onPress={() => navigation.navigate('MapScreen')} />
    </View>
  );
};

export default CarDashboard;
