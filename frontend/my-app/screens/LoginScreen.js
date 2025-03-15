import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { loginUser } from "../api"; // Ensure this is correctly imported
import AsyncStorage from "@react-native-async-storage/async-storage"; // For token storage

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser({ username, password });

      if (data.token) {
        // Store token & role in AsyncStorage
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("role", data.role);
        await AsyncStorage.setItem("username", username);

        Alert.alert("Login Successful", `Welcome, ${data.role}!`);

        // Navigate to appropriate screen based on role
        navigateToDashboard(data.role);
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Login Error", "An error occurred during login.");
    }
  };

  const navigateToDashboard = (role) => {
    switch (role) {
      case "admin":
        navigation.replace("AdminDashboard");
        break;
      case "car":
        navigation.replace("CarDashboard");
        break;
      default:
        navigation.replace("UserHomeScreen");
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 18 },
  linkText: { marginTop: 15, color: "#007bff" },
});

export default LoginScreen;
