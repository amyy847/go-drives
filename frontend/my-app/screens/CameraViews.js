import React, { useState, useRef, useEffect } from "react"
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal 
} from "react-native"
import { Camera as CameraIcon, ArrowLeft, WifiOff, Video, X } from "lucide-react-native"
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";
import { useCameraPermissions } from "expo-camera";



const CameraViews = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    console.log("🔍 Checking camera permissions...", permission);

    if (!permission) {
      console.warn("⚠️ Camera permission object is null. Waiting...");
      return;
    }

    if (permission.status === "granted") {
      console.log("✅ Camera permission granted!");
      setHasPermission(true);
    } else {
      console.warn("⛔ Camera permission denied! Requesting now...");
      requestPermission().then((newPermission) => {
        if (newPermission?.status === "granted") {
          console.log("✅ Camera permission granted after request!");
          setHasPermission(true);
        } else {
          console.log("⛔ Camera permission still denied!");
          setHasPermission(false);
        }
      });
    }
  }, [permission]);

  const toggleFullscreen = () => {
    console.log(`🔄 Fullscreen mode: ${!isFullscreen}`);
    setIsFullscreen(!isFullscreen);
  };

  const renderCameraContent = () => {
    console.log("🛠 Rendering Camera Content...");

    if (hasPermission === null) {
      return (
        <View style={styles.cameraView}>
          <CameraIcon size={48} color="#10b981" />
          <Text style={styles.placeholderText}>Requesting camera access...</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.cameraView}>
          <CameraIcon size={48} color="#ef4444" />
          <Text style={styles.placeholderText}>Camera access denied</Text>
        </View>
      );
    }

    if (!Camera) {
      return (
        <View style={styles.cameraView}>
          <Text>Error: Camera module is undefined</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.cameraView} 
        activeOpacity={0.9}
        onPress={toggleFullscreen}
      >
        <Camera ref={cameraRef} style={styles.cameraPreview} type={Camera.Constants.Type.front} />
        <View style={styles.cameraOverlay}>
          <Text style={styles.tapToExpandText}>Tap to expand</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
            {renderCameraContent()}
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Camera Modal */}
      {isFullscreen && (
        <Modal
          visible={true}
          animationType="fade"
          onRequestClose={toggleFullscreen}
        >
          <View style={styles.fullscreenContainer}>
            {Camera ? (
              <Camera ref={cameraRef} style={styles.fullscreenCamera} type={Camera.Constants.Type.front} />
            ) : (
              <Text>Error: Camera module is undefined</Text>
            )}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={toggleFullscreen}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};





const { width, height } = Dimensions.get("window");

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
    position: "relative",
  },
  placeholderText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },
  cameraPreview: {
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tapToExpandText: {
    color: "#fff",
    fontSize: 12,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenCamera: {
    width: width,
    height: height,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
})

export default CameraViews