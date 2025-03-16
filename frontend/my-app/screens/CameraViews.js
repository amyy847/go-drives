import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import { Camera, ArrowLeft, WifiOff, Video } from "lucide-react-native"

const CameraViews = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Go Drives</Text>
        <View style={styles.headerRight} />
      </View>

      <Text style={styles.screenTitle}>Camera Views</Text>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cameraGrid}>
          <View style={styles.cameraCard}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Front Camera</Text>
              <View style={styles.statusIndicator}>
                <Video size={16} color="#10b981" />
                <Text style={styles.statusText}>Live</Text>
              </View>
            </View>
            <View style={styles.cameraView}>
              <Camera size={48} color="#10b981" />
              <Text style={styles.placeholderText}>Front view active</Text>
            </View>
          </View>

          <View style={[styles.cameraCard, styles.offlineCard]}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Back Camera</Text>
              <View style={styles.offlineIndicator}>
                <WifiOff size={16} color="#ef4444" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            </View>
            <View style={styles.cameraView}>
              <Camera size={48} color="#9ca3af" />
              <Text style={styles.placeholderText}>Connection lost</Text>
            </View>
          </View>

          <View style={[styles.cameraCard, styles.offlineCard]}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Side 1</Text>
              <View style={styles.offlineIndicator}>
                <WifiOff size={16} color="#ef4444" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            </View>
            <View style={styles.cameraView}>
              <Camera size={48} color="#9ca3af" />
              <Text style={styles.placeholderText}>Connection lost</Text>
            </View>
          </View>

          <View style={[styles.cameraCard, styles.offlineCard]}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Side 2</Text>
              <View style={styles.offlineIndicator}>
                <WifiOff size={16} color="#ef4444" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            </View>
            <View style={styles.cameraView}>
              <Camera size={48} color="#9ca3af" />
              <Text style={styles.placeholderText}>Connection lost</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 16,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#dcfce7",
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534", // Dark green text
  },
  headerRight: {
    width: 40, // Balance the header
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 16,
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  cameraGrid: {
    flexDirection: "column",
    gap: 16,
  },
  cameraCard: {
    backgroundColor: "#dcfce7", // Very light green
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offlineCard: {
    backgroundColor: "#f1f5f9", // Light gray for offline
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#166534",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10b981",
    marginLeft: 4,
  },
  offlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 4,
  },
  cameraView: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  placeholderText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },
})

export default CameraViews

