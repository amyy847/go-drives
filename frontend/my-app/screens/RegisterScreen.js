"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { ArrowLeft, User, Car, Shield, Check, ChevronRight, Mail, Key, Phone, BookOpen } from "lucide-react-native"
import { registerUser, registerAdmin, registerCar } from "../api"

const RegisterScreen = ({ navigation }) => {
  // State variables
  const [step, setStep] = useState(1)
  const [role, setRole] = useState("")
  const [gucEmail, setGucEmail] = useState("")
  const [emailInput, setEmailInput] = useState("") // New state for raw email input
  const [emailSuggestion, setEmailSuggestion] = useState("") // New state for email suggestion
  const [spaceCount, setSpaceCount] = useState(0) // Track space key presses
  const [idNumber, setIdNumber] = useState("")
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [major, setMajor] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const emailInputRef = useRef(null)

  // Auto-advance to step 2 when role is selected
  useEffect(() => {
    if (role) {
      setStep(2)
    }
  }, [role])

  // Handle email input & auto-generate username
  const handleEmailChange = (text) => {
    // Check if the text already contains @ symbol
    if (text.includes("@")) {
      setEmailInput(text)
      setGucEmail(text)
      setEmailSuggestion("")

      // Extract username from email
      if (text.includes("@")) {
        setUsername(text.split("@")[0])
      }
      return
    }

    // Handle space key for auto-completion
    if (text.endsWith(" ")) {
      const trimmedText = text.trim()
      setSpaceCount((prevCount) => {
        // If this is the second space, apply the suggestion
        if (prevCount === 1 && emailSuggestion) {
          const fullEmail = `${trimmedText}@student.guc.edu.eg`
          setEmailInput(fullEmail)
          setGucEmail(fullEmail)
          setUsername(trimmedText)
          setEmailSuggestion("")

          // Focus on the next input field (ID number)
          setTimeout(() => {
            if (emailInputRef.current) {
              emailInputRef.current.blur()
            }
          }, 100)

          return 0
        }
        return 1
      })
      return
    }

    // Reset space count if user continues typing
    setSpaceCount(0)

    // Store the raw input
    setEmailInput(text)

    // Set the actual email value
    setGucEmail(text)

    // Generate username from email
    setUsername(text)

    // Show suggestion if input is not empty
    if (text.trim()) {
      setEmailSuggestion(`@student.guc.edu.eg`)
    } else {
      setEmailSuggestion("")
    }
  }

  // Validate ID number format
  const validateIdNumber = (id) => {
    // Valid prefixes: increments of 3 going back 12 years (55, 52, 49, etc.)
    const validPrefixes = [
      "01",
      "04",
      "07",
      "10",
      "13",
      "16",
      "19",
      "22",
      "25",
      "28",
      "31",
      "34",
      "37",
      "40",
      "43",
      "46",
      "49",
      "52",
      "55",
      "58",
      "61",
      "64",
    ]
    const idPattern = new RegExp(`^(${validPrefixes.join("|")})-\\d{4,5}$`)
    return idPattern.test(id)
  }

  // Validate phone number (11 digits)
  const validatePhoneNumber = (phone) => {
    return /^\d{11}$/.test(phone)
  }

  // Validate step 2 inputs
  const validateStep2 = () => {
    if (role === "user") {
      if (!gucEmail || !idNumber) {
        Alert.alert("Missing Information", "Please fill in all fields.")
        return false
      }

      if (!gucEmail.includes("@student.guc.edu.eg")) {
        Alert.alert("Invalid Email", "Please enter a valid GUC student email.")
        return false
      }

      if (!validateIdNumber(idNumber)) {
        Alert.alert("Invalid ID", "Please enter a valid GUC ID (e.g., 55-12345).")
        return false
      }

      return true
    } else if (role === "car" || role === "admin") {
      if (!username) {
        Alert.alert("Missing Information", "Please enter a username.")
        return false
      }

      return true
    }

    return false
  }

  // Validate step 3 inputs
  const validateStep3 = () => {
    if (role === "user") {
      if (!firstName || !lastName || !major || !phoneNumber) {
        Alert.alert("Missing Information", "Please fill in all fields.")
        return false
      }

      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert("Invalid Phone", "Please enter a valid 11-digit phone number.")
        return false
      }

      return true
    }

    return true
  }

  // Validate step 4 inputs
  const validateStep4 = () => {
    if (!password) {
      Alert.alert("Missing Password", "Please enter a password.")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.")
      return false
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.")
      return false
    }

    return true
  }

  // Handle registration submission
  const handleRegister = async () => {
    if (!validateStep4()) return

    setLoading(true)

    try {
      let response

      if (role === "user") {
        response = await registerUser({
          firstName,
          lastName,
          username,
          gucEmail,
          phoneNumber,
          idNumber,
          password,
          major,
        })
      } else if (role === "car") {
        response = await registerCar({
          username,
          password,
        })
      } else if (role === "admin") {
        response = await registerAdmin({
          email: gucEmail,
          username,
          password,
        })
      }

      setRegistrationSuccess(true)
    } catch (error) {
      console.error("Registration Error:", error)
      setRegistrationSuccess(false)
    } finally {
      setLoading(false)
      setRegistrationComplete(true)
    }
  }

  // Navigate to next step
  const goToNextStep = () => {
    if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    }
  }

  // Render role selection (Step 1)
  const renderRoleSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Account Type</Text>
      <Text style={styles.stepDescription}>Choose the type of account you want to create</Text>

      <TouchableOpacity style={styles.roleCard} onPress={() => setRole("user")}>
        <View style={styles.roleIconContainer}>
          <User size={24} color="#10b981" />
        </View>
        <View style={styles.roleTextContainer}>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>Register as a GUC student</Text>
        </View>
        <ChevronRight size={20} color="#10b981" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.roleCard} onPress={() => setRole("car")}>
        <View style={styles.roleIconContainer}>
          <Car size={24} color="#10b981" />
        </View>
        <View style={styles.roleTextContainer}>
          <Text style={styles.roleTitle}>Car</Text>
          <Text style={styles.roleDescription}>Register as a car driver</Text>
        </View>
        <ChevronRight size={20} color="#10b981" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.roleCard} onPress={() => setRole("admin")}>
        <View style={styles.roleIconContainer}>
          <Shield size={24} color="#10b981" />
        </View>
        <View style={styles.roleTextContainer}>
          <Text style={styles.roleTitle}>Admin</Text>
          <Text style={styles.roleDescription}>Register as an administrator</Text>
        </View>
        <ChevronRight size={20} color="#10b981" />
      </TouchableOpacity>
    </View>
  )

  // Render GUC credentials (Step 2)
  const renderCredentials = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{role === "user" ? "GUC Credentials" : "Account Information"}</Text>
      <Text style={styles.stepDescription}>
        {role === "user" ? "Enter your GUC email and ID number" : "Enter your account information"}
      </Text>

      {role === "user" && (
        <>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#10b981" style={styles.inputIcon} />
            <View style={styles.emailInputWrapper}>
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder="GUC Email"
                value={emailInput}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailSuggestion ? <Text style={styles.emailSuggestion}>{emailSuggestion}</Text> : null}
            </View>
          </View>
          {spaceCount === 1 && emailSuggestion && <Text style={styles.emailHint}>Press space again to complete</Text>}

          <View style={styles.inputContainer}>
            <Key size={20} color="#10b981" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="GUC ID (e.g., 55-12345)"
              value={idNumber}
              onChangeText={setIdNumber}
            />
          </View>
        </>
      )}

      {(role === "car" || role === "admin") && (
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
      )}

      {role === "admin" && (
        <View style={styles.inputContainer}>
          <Mail size={20} color="#10b981" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={gucEmail}
            onChangeText={setGucEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={goToNextStep}>
        <Text style={styles.buttonText}>Next</Text>
        <ChevronRight size={20} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )

  // Render personal information (Step 3)
  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>Tell us more about yourself</Text>

      <View style={styles.inputContainer}>
        <User size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      </View>

      <View style={styles.inputContainer}>
        <User size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      </View>

      <View style={styles.inputContainer}>
        <BookOpen size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholder="Major" value={major} onChangeText={setMajor} />
      </View>

      <View style={styles.inputContainer}>
        <Phone size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={goToNextStep}>
        <Text style={styles.buttonText}>Next</Text>
        <ChevronRight size={20} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )

  // Render password setup (Step 4)
  const renderPasswordSetup = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set Password</Text>
      <Text style={styles.stepDescription}>Create a secure password for your account</Text>

      <View style={styles.inputContainer}>
        <Key size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Key size={20} color="#10b981" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Text style={styles.buttonText}>Register</Text>
            <Check size={20} color="#ffffff" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(role === "user" ? 3 : 2)}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )

  // Render registration result
  const renderRegistrationResult = () => (
    <View style={styles.stepContainer}>
      <View
        style={[
          styles.resultIconContainer,
          registrationSuccess ? styles.successIconContainer : styles.errorIconContainer,
        ]}
      >
        {registrationSuccess ? <Check size={48} color="#ffffff" /> : <ArrowLeft size={48} color="#ffffff" />}
      </View>

      <Text style={styles.resultTitle}>{registrationSuccess ? "Registration Successful" : "Registration Failed"}</Text>

      <Text style={styles.resultDescription}>
        {registrationSuccess
          ? "Your account has been created. Awaiting admin approval."
          : "There was an error creating your account. Please try again."}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>{registrationSuccess ? "Go to Login" : "Try Again"}</Text>
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
        {/* Progress indicator */}
        {!registrationComplete && (
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((stepNumber) => (
              <View
                key={stepNumber}
                style={[
                  styles.progressStep,
                  step >= stepNumber && styles.activeProgressStep,
                  stepNumber < 4 && styles.progressStepWithLine,
                ]}
              >
                <Text style={[styles.progressStepText, step >= stepNumber && styles.activeProgressStepText]}>
                  {stepNumber}
                </Text>
                {stepNumber < 4 && (
                  <View style={[styles.progressLine, step > stepNumber && styles.activeProgressLine]} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Step content */}
        {step === 1 && renderRoleSelection()}
        {step === 2 && renderCredentials()}
        {step === 3 && role === "user" && renderPersonalInfo()}
        {step === 4 && !registrationComplete && renderPasswordSetup()}
        {registrationComplete && renderRegistrationResult()}

        {/* Login link */}
        {!registrationComplete && (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  activeProgressStep: {
    backgroundColor: "#10b981",
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748b",
  },
  activeProgressStepText: {
    color: "#ffffff",
  },
  progressStepWithLine: {
    marginRight: 40,
  },
  progressLine: {
    position: "absolute",
    right: -40,
    top: 14,
    width: 40,
    height: 2,
    backgroundColor: "#e2e8f0",
  },
  activeProgressLine: {
    backgroundColor: "#10b981",
  },
  stepContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: "#6b7280",
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
  // New styles for email input
  emailInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  emailSuggestion: {
    position: "absolute",
    left: "auto",
    right: 0,
    fontSize: 16,
    color: "#9ca3af", // Light gray color for suggestion
    paddingVertical: 16,
  },
  emailHint: {
    fontSize: 12,
    color: "#10b981",
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
    fontStyle: "italic",
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
  backButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  backButtonText: {
    color: "#4b5563",
    fontSize: 16,
  },
  loginLink: {
    textAlign: "center",
    color: "#10b981",
    fontSize: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  resultIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    alignSelf: "center",
    marginTop: 40,
  },
  successIconContainer: {
    backgroundColor: "#10b981",
  },
  errorIconContainer: {
    backgroundColor: "#ef4444",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
})

export default RegisterScreen

