import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { registerUser, uploadImage as uploadImageToCloudinary , registerAdmin, registerCar} from "../api"; // ✅ Rename import
import * as ImageManipulator from "expo-image-manipulator";

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [gucEmail, setGucEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idPicture, setIdPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection

  // Handle email input & auto-generate username
  const handleEmailChange = (email) => {
    setGucEmail(email);
    if (email.includes("@student.guc.edu.eg")) {
      setUsername(email.split("@")[0]);
    }
  };

  const pickImage = async () => {
    console.log("Opening Image Picker..."); // ✅ Debugging log
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      quality: 1,
    });
  
    console.log("Image Picker Result:", result); // ✅ Check what result looks like
  
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Selected Image URI:", imageUri); // ✅ Log selected image URI
  
      setUploading(true);
  
      try {
        let formData = new FormData();
        formData.append("idPicture", {
          uri: imageUri,
          type: "image/jpeg",
          name: "idPicture.jpg",
        });
  
        console.log("Uploading image..."); // ✅ Debug before upload
  
        const response = await uploadImageToCloudinary(formData); // ✅ Upload API call
        console.log("Upload Response:", response); // ✅ Log Cloudinary response
  
        setIdPicture(response.imageUrl);
        Alert.alert("Success", "ID Picture uploaded!");
      } catch (error) {
        Alert.alert("Upload Failed", "Could not upload the ID picture. Try again.");
        console.error("Upload Error:", error);
      } finally {
        setUploading(false);
      }
    } else {
      console.log("Image picking canceled or failed.");
    }
  };
  
  const handleRegister = async () => {
    try {
      let response;
      if (role === "user") {
        response = await registerUser({
          firstName,
          lastName,
          username,
          gucEmail,
          phoneNumber,
          idNumber,
          idPicture: "https://dummyimage.com/600x400/000/fff&text=Dummy+ID",
          password,
          major,
        });
      } else if (role === "car") {
        response = await registerCar({
          username,
          password,
        });
      } else if (role === "admin") {
        response = await registerAdmin({
          email: gucEmail,
          username,
          password,
        });
      }
  
      Alert.alert("Success", "Registration successful. Awaiting admin approval.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Register User Error:", error);
      Alert.alert("Registration Failed", error?.response?.data?.message || "An error occurred");
    }
  };
  
  const validateIdNumber = (idNumber) => {
    const idPattern = /^(55|52|49|46|43|40|37|34|31|28|25|22|19|16|13|10|07|04|01|58|61|64)-\d{4,5}$/;
    return idPattern.test(idNumber);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateStep1 = () => {
    if (!role) {
      Alert.alert("Validation Error", "Please select a role.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (role === "user") {
      if (!gucEmail || !idNumber) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return false;
      }
      if (!gucEmail.includes("@student.guc.edu.eg")) {
        Alert.alert("Validation Error", "Please enter a valid GUC email.");
        return false;
      }
      if (!validateIdNumber(idNumber)) {
        Alert.alert("Validation Error", "Please enter a valid ID Number (e.g., 55-12345).");
        return false;
      }
    } else if (role === "car") {
      if (!username || !password) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return false;
      }
    } else if (role === "admin") {
      if (!gucEmail || !username || !password) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    if (role === "user") {
      if (!firstName || !lastName || !major || !phoneNumber) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return false;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert("Validation Error", "Please enter a valid 11-digit phone number.");
        return false;
      }
    }
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      {step === 1 && (
        <>
          <Text style={styles.label}>Select Role</Text>
          <TouchableOpacity style={styles.roleButton} onPress={() => setRole("user")}>
            <Text style={styles.buttonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roleButton} onPress={() => setRole("car")}>
            <Text style={styles.buttonText}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roleButton} onPress={() => setRole("admin")}>
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => validateStep1() && setStep(2)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && role === "user" && (
        <>
          <TextInput style={styles.input} placeholder="GUC Email" value={gucEmail} onChangeText={handleEmailChange} />
          <TextInput style={styles.input} placeholder="ID Number" value={idNumber} onChangeText={setIdNumber} />
          <TouchableOpacity style={styles.button} onPress={() => validateStep2() && setStep(3)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => setStep(1)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && role === "car" && (
        <>
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={() => validateStep2() && setStep(4)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => setStep(1)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && role === "admin" && (
        <>
          <TextInput style={styles.input} placeholder="GUC Email" value={gucEmail} onChangeText={handleEmailChange} />
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={() => validateStep2() && setStep(4)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => setStep(1)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && role === "user" && (
        <>
          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Major" value={major} onChangeText={setMajor} />
          <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={() => validateStep3() && setStep(4)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => setStep(role === "user" ? 3 : 2)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingVertical: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, width: "80%", alignItems: "center", marginBottom: 10 },
  uploadButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 18 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
  linkText: { marginTop: 15, color: "#007bff" },
  navigationButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  smallButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 10, width: "40%", alignItems: "center", marginTop: 10 },
  roleButton: { backgroundColor: "#6c757d", padding: 15, borderRadius: 10, width: "80%", alignItems: "center", marginBottom: 10 },
  label: { fontSize: 18, marginBottom: 10 },
});

export default RegisterScreen;
