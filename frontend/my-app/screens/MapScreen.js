// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
// import MapView, { PROVIDER_DEFAULT, Marker, UrlTile } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const MapScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const requestLocationPermission = async () => {
//     try {
//       const permission = Platform.OS === 'ios' 
//         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
//         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
//       const permissionStatus = await check(permission);
      
//       if (permissionStatus === RESULTS.GRANTED) {
//         getCurrentLocation();
//       } else {
//         const result = await request(permission);
//         if (result === RESULTS.GRANTED) {
//           getCurrentLocation();
//         } else {
//           setError('Location permission denied');
//           setLoading(false);
//         }
//       }
//     } catch (err) {
//       console.error('Error checking location permission:', err);
//       setError('Failed to request location permission');
//       setLoading(false);
//     }
//   };

//   const getCurrentLocation = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({
//           latitude,
//           longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Error getting current location:', err);
//         setError('Failed to get current location');
//         setLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#166534" />
//         <Text style={styles.loadingText}>Getting your location...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {location ? (
//         <MapView
//           style={styles.map}
//           provider={PROVIDER_DEFAULT}
//           initialRegion={location}
//           showsUserLocation={true}
//           showsMyLocationButton={true}
//         >
//           {/* OpenStreetMap Tile Overlay */}
//           <UrlTile
//             urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             maximumZ={19}
//             flipY={false}
//           />
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title="You are here"
//             description="Your current location"
//           />
//         </MapView>
//       ) : (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorText}>Unable to get location</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#166534',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#ef4444',
//     textAlign: 'center',
//   },
// });

// export default MapScreen;




import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform, Button } from "react-native";
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setLoading(false);
      return;
    }
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    let userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setLoading(false);
  };

  const generateRandomDestination = () => {
    if (!location) return;
    const earthRadius = 6371; // Radius of the Earth in km
    const distance = 12 / earthRadius; // 12 km in radians
    const bearing = Math.random() * 2 * Math.PI; // Random direction

    const lat1 = (location.latitude * Math.PI) / 180;
    const lon1 = (location.longitude * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
        Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
      );

    setDestination({
      latitude: (lat2 * 180) / Math.PI,
      longitude: (lon2 * 180) / Math.PI,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#166534" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />

          <Marker coordinate={location} title="You are here" description="Your current location" />

          {destination && <Marker coordinate={destination} title="Destination" description="Random 12km away" />}

          {destination && (
            <MapViewDirections
              origin={location}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Start Journey" onPress={generateRandomDestination} color="#166534" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#166534" },
  errorText: { fontSize: 16, color: "#ef4444", textAlign: "center" },
  buttonContainer: { position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: "white", padding: 10, borderRadius: 10, elevation: 5 },
});

export default MapScreen;
