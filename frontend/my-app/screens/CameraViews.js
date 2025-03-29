import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import { Camera,  CameraType } from "expo-camera";
import { ArrowLeft, X } from "lucide-react-native";
import { useCameraPermissions } from "expo-camera";

console.log("📌 Importing Camera module...");
console.log("🔄 Camera:", Camera);
console.log("📷 Camera Module:", JSON.stringify(Camera, null, 2));
console.log("📷 Available Camera Types:", Camera.Constants?.Type);


const CameraViews = ({ navigation }) => {
  console.log("📌 CameraViews component mounted");
  const [hasPermission, setHasPermission] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    console.log("🔍 Checking camera permissions...");
    (async () => {
      if (!permission) {
        console.warn("⚠️ Camera permission object is null. Waiting...");
        return;
      }

      console.log("🔄 Current permission status:", permission.status);
      if (permission.status === "granted") {
        console.log("✅ Camera permission already granted");
        setHasPermission(true);
      } else {
        console.warn("⛔ Camera permission denied! Requesting now...");
        const newPermission = await requestPermission();
        console.log("🔄 New permission status:", newPermission.status);
        setHasPermission(newPermission.status === "granted");
      }
    })();
  }, [permission]);

  const toggleFullscreen = () => {
    console.log(`🔄 Fullscreen mode: ${!isFullscreen}`);
    setIsFullscreen(!isFullscreen);
  };

  if (hasPermission === null) {
    console.log("🛠 Waiting for user to grant camera permission...");
    return <Text>Requesting camera permissions...</Text>;
  }

  if (hasPermission === false) {
    console.error("⛔ Camera access denied by user!");
    return <Text>Camera access denied</Text>;
  }

  console.log("✅ Rendering camera preview...");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Go Drives</Text>
      </View>

      <Text style={styles.screenTitle}>Camera Views</Text>

      <TouchableOpacity onPress={toggleFullscreen} style={styles.cameraContainer}>
        <Camera ref={cameraRef} style={styles.camera} type={CameraType.front} />
      </TouchableOpacity>

      {isFullscreen && (
        <Modal visible={true} animationType="slide" onRequestClose={toggleFullscreen}>
          <View style={styles.fullscreenContainer}>
            <Camera ref={cameraRef} style={styles.fullscreenCamera} type={CameraType.front} />
            <TouchableOpacity style={styles.closeButton} onPress={toggleFullscreen}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  appTitle: { fontSize: 20, fontWeight: "bold", color: "#166534" },
  screenTitle: { fontSize: 24, fontWeight: "bold", color: "#166534", marginBottom: 16 },
  cameraContainer: { width: "100%", height: 300, backgroundColor: "#ccc" },
  camera: { flex: 1 },
  fullscreenContainer: { flex: 1, backgroundColor: "#000" },
  fullscreenCamera: { width: "100%", height: "100%" },
  closeButton: { position: "absolute", top: 40, right: 20, padding: 8, backgroundColor: "rgba(0,0,0,0.5)" },
});

export default CameraViews;
