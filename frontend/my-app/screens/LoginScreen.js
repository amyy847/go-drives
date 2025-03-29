"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { ArrowLeft, User, Key, LogIn, AlertCircle } from "lucide-react-native"
import { loginUser } from "../api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showApprovalScreen, setShowApprovalScreen] = useState(false)
  const [userRole, setUserRole] = useState("")

  const handleLogin = async () => {
    // Validate inputs
    if (!username || !password) {
      Alert.alert("Missing Information", "Please enter both username and password.")
      return
    }

    setLoading(true)

    try {
      const data = await loginUser({ username, password })
      console.log(data);

      if (data.token) {
        // Check if user is approved
        if (data.isApproved === false) {
          // User is not approved, show approval screen
          setUserRole(data.role)
          setShowApprovalScreen(true)

          // Still store the token for future use
          await AsyncStorage.setItem("token", data.token)
          await AsyncStorage.setItem("role", data.role)
          await AsyncStorage.setItem("username", username)
        } else {
          // User is approved, proceed with login
          await AsyncStorage.setItem("token", data.token)
          await AsyncStorage.setItem("role", data.role)
          await AsyncStorage.setItem("username", username)

          // Navigate to appropriate screen based on role
          navigateToDashboard(data.role)
        }
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Login Error", "An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const navigateToDashboard = (role) => {
    switch (role) {
      case "admin":
        navigation.replace("AdminDashboard")
        break
      case "car":
        navigation.replace("CarDashboard")
        break
      default:
        navigation.replace("UserHomeScreen")
        break
    }
  }

  // Render the approval pending screen
  const renderApprovalScreen = () => (
    <View style={styles.approvalContainer}>
      <View style={styles.approvalIconContainer}>
        <AlertCircle size={48} color="#ffffff" />
      </View>

      <Text style={styles.approvalTitle}>Account Pending Approval</Text>

      <Text style={styles.approvalDescription}>
        Your {userRole} account has been registered but is awaiting administrator approval. You'll be notified once your
        account is approved.
      </Text>
    </View>
  )

  // Render the login form
  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.welcomeTitle}>Welcome Back</Text>
      <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>

      <View style={styles.inputContainer}>
        <User size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Key size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Text style={styles.buttonText}>Login</Text>
            <LogIn size={20} color="#ffffff" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Go Drives</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {showApprovalScreen ? renderApprovalScreen() : renderLoginForm()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4", // Light green background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  linkText: {
    textAlign: "center",
    color: "#10b981",
    fontSize: 16,
  },
  approvalContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  approvalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f59e0b", // Amber color for warning
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  approvalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
    marginBottom: 16,
  },
  approvalDescription: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
})

export default LoginScreen

