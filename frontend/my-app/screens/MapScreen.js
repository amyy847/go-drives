import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const OPENROUTE_API_KEY = "5b3ce3597851110001cf6248b7dbbb8563cf409e898a5fa7e374febe";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState({
    latitude: 29.98698645034215, // Replace with actual coordinates
    longitude: 31.441710575756055,
  });
  const [route, setRoute] = useState([]);

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
    startTrackingLocation();
  };

  const startTrackingLocation = async () => {
    let subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (newLocation) => {
        setLocation({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        fetchOptimizedRoute({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        });
      }
    );

    setLoading(false);
    return () => subscription.remove(); // Stop tracking when component unmounts
  };

  const fetchOptimizedRoute = async (currentLocation) => {
    if (!currentLocation) {
      setError("Current location not available");
      return;
    }

    try {
      console.log("Fetching optimized route...");
      console.log(`Start: ${currentLocation.latitude}, ${currentLocation.longitude}`);
      console.log(`End: ${destination.latitude}, ${destination.longitude}`);

      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTE_API_KEY}&start=${currentLocation.longitude},${currentLocation.latitude}&end=${destination.longitude},${destination.latitude}`
      );

      console.log("Route API Response:", response.data);

      const coordinates = response.data.features[0].geometry.coordinates.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      setRoute(coordinates);
    } catch (err) {
      console.error("Error fetching route:", err);
      setError("Failed to get optimized route");
    }
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
        <MapView style={styles.map} region={location} showsUserLocation={true}>
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />

          <Marker coordinate={location} title="You are here" description="Your current location" />

          <Marker coordinate={destination} title="Destination" description="Optimized destination" />

          {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />}
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Start Journey" onPress={() => fetchOptimizedRoute(location)} color="#166534" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#166534",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default MapScreen;
