import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { useEffect, useState } from "react"
import {
  Battery,
  Navigation,
  Clock,
  Gauge,
  MapPin,
  Wifi,
  Camera,
  Activity,
  Users,
  AlertTriangle,
} from "lucide-react-native"

const CarDashboard = ({ navigation, route }) => {
  const { carData } = route.params // Retrieve car data from route params
  console.log("Car data from route:", carData)
  const [fetchedCarData, setFetchedCarData] = useState(null)

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://192.168.100.88:5000/api/car/${carData.id}`)
        const data = await response.json()
        console.log("Fetched car data:", data)
        setFetchedCarData(data)
      } catch (error) {
        console.error("Error fetching car data:", error)
      }
    }

    if (carData?.id) {
      fetchCarData()
    }
  }, [])

  console.log("Fetched car data:", fetchedCarData)

  const batteryLevel = fetchedCarData?.batteryLevel || 78
  const currentSpeed = fetchedCarData?.currentSpeed || 65
  const nextStop = fetchedCarData?.nextStop || "Central Station"
  const minutesToNextStop = fetchedCarData?.minutesToNextStop || 12

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Go Drives</Text>
        <View style={styles.batteryContainer}>
          <Battery style={styles.batteryIcon} color="#10b981" />
          <Text style={styles.batteryText}>{batteryLevel}%</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Gauge size={32} color="#10b981" />
          <Text style={styles.statValue}>{currentSpeed}</Text>
          <Text style={styles.statLabel}>mph</Text>
        </View>

        <View style={styles.statCard}>
          <MapPin size={32} color="#10b981" />
          <Text style={styles.statValue}>{nextStop}</Text>
          <Text style={styles.statLabel}>Next Stop</Text>
        </View>

        <View style={styles.statCard}>
          <Clock size={32} color="#10b981" />
          <Text style={styles.statValue}>{minutesToNextStop}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
      </View>

      <View style={styles.navigationGrid}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("LidarData")}>
          <Wifi size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Lidar Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("CarData",{ fetchedCarData })}>
          <Activity size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Car Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("RadarData")}>
          <AlertTriangle size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Radar Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("PassengerData",{ fetchedCarData })}>
          <Users size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Passenger Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("CameraViews",{ fetchedCarData })}>
          <Camera size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Camera Views</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("MapScreen", { fetchedCarData })}>
          <Navigation size={28} color="#ffffff" />
          <Text style={styles.navButtonText}>Map Screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4", // Light green background
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534", // Dark green text
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7", // Very light green
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  batteryIcon: {
    marginRight: 6,
  },
  batteryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534", // Dark green text
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#dcfce7", // Very light green
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534", // Dark green text
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#4ade80", // Medium green
    marginTop: 4,
  },
  navigationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  navButton: {
    backgroundColor: "#10b981", // Green
    width: "48%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonText: {
    color: "white",
    fontWeight: "600",
    marginTop: 8,
    fontSize: 16,
  },
})

export default CarDashboard

