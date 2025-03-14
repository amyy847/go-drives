import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export default function CameraScreen() {
  const cameraRef = useRef(null);

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({});
      console.log("Image captured:", photo);
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} />
      <TouchableOpacity onPress={captureImage} style={styles.captureButton}>
        <Text style={styles.buttonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  captureButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: 'blue', padding: 15 },
  buttonText: { color: 'white' }
});
