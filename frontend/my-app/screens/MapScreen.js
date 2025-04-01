import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const API_BASE_URL = "http://192.168.100.88:5000/api/car";

const MapScreen = ({ route }) => {
  const { fetchedCarData } = route.params || {};
  console.log("Car data in MapScreen:", fetchedCarData);
  const carId = fetchedCarData?._id;

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [destination, setDestination] = useState({
    latitude: fetchedCarData?.currentDestination?.latitude || 29.98698645034215,
    longitude: fetchedCarData?.currentDestination?.longitude || 31.441710575756055,
  });
  const [carRoute, setCarRoute] = useState([]);

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
      async (newLocation) => {
        const currentLocation = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };

        setLocation({
          ...currentLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        await sendLocationToAPI(currentLocation);
      }
    );
    setLoading(false);
    return () => subscription.remove();
  };

  const sendLocationToAPI = async (currentLocation) => {
    try {
      await axios.put(`${API_BASE_URL}/${carId}/location`, { currentLocation });
      console.log("Location sent to API:", currentLocation);
    } catch (err) {
      console.error("Error sending location:", err);
    }
  };

  const fetchCarRouteFromAPI = async () => {
    if (journeyStarted) return; // Prevent multiple calls

    setJourneyStarted(true);
    console.log("Fetching car route...");

    try {
      const response = await axios.get(`${API_BASE_URL}/${carId}/route`);
      console.log("Route API Response:", response.data);

      const { startLocation, secondLocation, endLocation } = response.data || {};

      // Validate coordinates
      const isValidCoordinate = (coord) =>
        coord && typeof coord.latitude === "number" && typeof coord.longitude === "number";

      console.log("Validating coordinates...");

      if (!isValidCoordinate(startLocation)) {
        console.error("Invalid startLocation:", startLocation);
        setError("Invalid start location data");
        return;
      }
      if (!isValidCoordinate(secondLocation)) {
        console.error("Invalid secondLocation:", secondLocation);
        setError("Invalid second location data");
        return;
      }
      if (!isValidCoordinate(endLocation)) {
        console.error("Invalid endLocation:", endLocation);
        setError("Invalid end location data");
        return;
      }

      console.log("All coordinates are valid!");

      setCarRoute([
        { latitude: startLocation.latitude, longitude: startLocation.longitude },
        { latitude: secondLocation.latitude, longitude: secondLocation.longitude },
        { latitude: endLocation.latitude, longitude: endLocation.longitude },
      ]);
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

          {carRoute.length > 0 && <Polyline coordinates={carRoute} strokeWidth={4} strokeColor="blue" />}
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Start Journey" onPress={fetchCarRouteFromAPI} color="#166534" />
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
  buttonContainer: { position: "absolute", bottom: 20, left: 20, right: 20 },
});

export default MapScreen;
