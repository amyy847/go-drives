import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';

const CameraViews = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null); // Store selected image URI
  const [imageBase64, setImageBase64] = useState(null); // Store image base64 for upload


  useEffect(() => {
    // Request camera roll permission
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    };
  
    requestPermissions();
  }, []);
  // Function to open gallery and pick an image
  const pickImage = async () => {
    console.log('Pick Image');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // Restrict to images
      allowsEditing: true, // Option to crop/resize the image
      quality: 1, // High-quality image
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.uri); // Set the image URI for displaying
      const base64Image = await convertUriToBase64(result.uri); // Convert URI to base64
      setImageBase64(base64Image); // Set the base64 string
    }
  };

  // Convert image URI to base64
  const convertUriToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to upload the selected image
  const uploadImage = async () => {
    if (imageBase64) {
      try {
        const response = await axios.post('http://localhost:3000/api/images/upload', {
          image: imageBase64, // Send the base64 encoded image
        });

        if (response.data.imageUrl) {
          console.log('Image uploaded to Cloudinary:', response.data.imageUrl);
          // You can store the image URL if needed or display it
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ScrollView style={{ flex: 1 }}>
        <Text>Select and upload an image from the gallery</Text>

        <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#10b981' }} onPress={pickImage}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Select Image from Gallery</Text>
        </TouchableOpacity>

        {/* Display the selected image */}
        {imageUri && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>Selected Image:</Text>
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10 }} />
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#10b981' }} onPress={uploadImage}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#dcfce7',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
  },
  headerRight: {
    width: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  cameraGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  uploadButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  uploadedImageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

export default CameraViews;
