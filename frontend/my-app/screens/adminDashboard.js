"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native"
import {
  Users,
  Car,
  Search,
  UserCheck,
  UserX,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  X,
  Battery,
  User as UserIcon,
  Mail,
  Phone,
  BookOpen,
  Hash,
  Check,
} from "lucide-react-native"

const API_BASE_URL = "http://192.168.100.88:5000/api"

const AdminDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("users")
  const [userFilter, setUserFilter] = useState("all")
  const [carFilter, setCarFilter] = useState("all")
  const [users, setUsers] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Detail modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchCars()
  }, [])

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log("Fetching users...")
      const response = await axios.get(`${API_BASE_URL}/user/`)
      console.log("Response:", response.data)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setLoading(true)
      console.log("Fetching cars...")
      const response = await axios.get(`${API_BASE_URL}/car/`)
      console.log("Cars response:", response.data)
      setCars(response.data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user by ID
  const fetchUserById = async (userId) => {
    try {
      setDetailLoading(true)
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`)
      setSelectedUser(response.data)
      setDetailModalVisible(true)
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setDetailLoading(false)
    }
  }

  // Fetch car by ID
  const fetchCarById = async (carId) => {
    try {
      setDetailLoading(true)
      const response = await axios.get(`${API_BASE_URL}/car/${carId}`)
      setSelectedCar(response.data)
      setDetailModalVisible(true)
    } catch (error) {
      console.error("Error fetching car details:", error)
    } finally {
      setDetailLoading(false)
    }
  }

  // Approve User
  const handleUserApproval = async (userId, isApproved) => {
    try {
      console.log(`Approving user ${userId}`)
      const response = await fetch(`${API_BASE_URL}/user/${userId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      })

      if (response.ok) {
        fetchUsers()
        if (selectedUser && selectedUser._id === userId) {
          fetchUserById(userId) // Refresh detail view if open
        }
      }
    } catch (error) {
      console.error("Error approving user:", error)
    }
  }

  // Deactivate User
  const handleUserDeactivation = async (userId, isActive) => {
    try {
      console.log(`Deactivating user ${userId}`)
      const response = await fetch(`${API_BASE_URL}/user/${userId}/deactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      })

      if (response.ok) {
        fetchUsers()
        if (selectedUser && selectedUser._id === userId) {
          fetchUserById(userId) // Refresh detail view if open
        }
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
    }
  }

  // Activate User
  const handleUserActivation = async (userId) => {
    try {
      console.log(`Activating user ${userId}`)
      const response = await fetch(`${API_BASE_URL}/user/${userId}/activate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      })

      if (response.ok) {
        fetchUsers()
        if (selectedUser && selectedUser._id === userId) {
          fetchUserById(userId) // Refresh detail view if open
        }
      }
    } catch (error) {
      console.error("Error activating user:", error)
    }
  }

  // Approve Car
  const handleCarApproval = async (carId) => {
    try {
      console.log(`Approving car ${carId}`)
      const response = await fetch(`${API_BASE_URL}/car/${carId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      })

      if (response.ok) {
        fetchCars()
        if (selectedCar && selectedCar._id === carId) {
          fetchCarById(carId)
          console.log(response?.data);
        }
      }
    } catch (error) {
      console.error("Error approving car:", error)
    }
  }

  // Deactivate Car
  const handleCarDeactivation = async (carId) => {
    try {
      console.log(`Deactivating car ${carId}`)
      const response = await fetch(`${API_BASE_URL}/car/${carId}/deactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      })

      if (response.ok) {
        fetchCars()
        if (selectedCar && selectedCar._id === carId) {
          fetchCarById(carId) // Refresh detail view if open
        }
      }
    } catch (error) {
      console.error("Error deactivating car:", error)
    }
  }

  // Activate Car
  const handleCarActivation = async (carId) => {
    try {
      console.log(`Activating car ${carId}`)
      const response = await fetch(`${API_BASE_URL}/car/${carId}/activate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      })

      if (response.ok) {
        fetchCars()
        if (selectedCar && selectedCar._id === carId) {
          fetchCarById(carId) // Refresh detail view if open
        }
      }
    } catch (error) {
      console.error("Error activating car:", error)
    }
  }

  // Filter users based on selected filter and search query
  const getFilteredUsers = () => {
    let filtered = users

    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.gucEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.idNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    switch (userFilter) {
      case "pending":
        return filtered.filter((user) => !user.isApproved)
      case "active":
        return filtered.filter((user) => user.isApproved && user.isActive)
      case "inactive":
        return filtered.filter((user) => user.isApproved && !user.isActive)
      case "all":
      default:
        return filtered
    }
  }

  // Filter cars based on selected filter and search query
  const getFilteredCars = () => {
    let filtered = cars

    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter((car) => car.username?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    switch (carFilter) {
      case "pending":
        return filtered.filter((car) => !car.isApproved)
      case "active":
        return filtered.filter((car) => car.isApproved && car.isActive)
      case "inactive":
        return filtered.filter((car) => car.isApproved && !car.isActive)
      case "all":
      default:
        return filtered
    }
  }

  // Get counts for stats display
  const getUserCounts = () => {
    const total = users.length
    const active = users.filter((user) => user.isApproved && user.isActive).length
    const pending = users.filter((user) => !user.isApproved).length
    const inactive = users.filter((user) => user.isApproved && !user.isActive).length

    return { total, active, pending, inactive }
  }

  const getCarCounts = () => {
    const total = cars.length
    const active = cars.filter((car) => car.isApproved && car.isActive).length
    const pending = cars.filter((car) => !car.isApproved).length
    const inactive = cars.filter((car) => car.isApproved && !car.isActive).length

    return { total, active, pending, inactive }
  }

  // Render User Item
  const renderUserItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemMain}>
        <View style={styles.listItemIcon}>
          <Users size={20} color="#10b981" />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{`${item.firstName || ""} ${item.lastName || ""}`}</Text>
          <Text style={styles.listItemSubtitle}>{item.gucEmail}</Text>
          <Text style={styles.listItemLocation}>ID: {item.idNumber}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                item.isApproved
                  ? item.isActive
                    ? styles.activeIndicator
                    : styles.inactiveIndicator
                  : styles.pendingIndicator,
              ]}
            />
            <Text style={styles.statusText}>
              {!item.isApproved ? "Pending Approval" : item.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => fetchUserById(item._id)}>
          <Eye size={18} color="#10b981" />
        </TouchableOpacity>

        {!item.isApproved && (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleUserApproval(item._id)}
          >
            <UserCheck size={18} color="#10b981" />
          </TouchableOpacity>
        )}

        {item.isActive && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deactivateButton]}
            onPress={() => handleUserDeactivation(item._id)}
          >
            <UserX size={18} color="#ef4444" />
          </TouchableOpacity>
        )}

        {!item.isActive && item.isApproved && (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => handleUserActivation(item._id)}
          >
            <Check size={18} color="#10b981" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  // Render Car Item
  const renderCarItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemMain}>
        <View style={styles.listItemIcon}>
          <Car size={20} color="#10b981" />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>Username: {item.username}</Text>
          <Text style={styles.listItemSubtitle}>Role: {item.role}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                item.isApproved
                  ? item.isActive
                    ? styles.activeIndicator
                    : styles.inactiveIndicator
                  : styles.pendingIndicator,
              ]}
            />
            <Text style={styles.statusText}>
              {!item.isApproved ? "Pending Approval" : item.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => fetchCarById(item._id)}>
          <Eye size={18} color="#10b981" />
        </TouchableOpacity>

        {!item.isApproved && (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleCarApproval(item._id)}
          >
            <CheckCircle size={18} color="#10b981" />
          </TouchableOpacity>
        )}

        {item.isActive && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deactivateButton]}
            onPress={() => handleCarDeactivation(item._id)}
          >
            <XCircle size={18} color="#ef4444" />
          </TouchableOpacity>
        )}

        {!item.isActive && item.isApproved && (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => handleCarActivation(item._id)}
          >
            <Check size={18} color="#10b981" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  // Render User Detail Modal
  const renderUserDetailModal = () => (
    <Modal
      visible={detailModalVisible && selectedUser !== null}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setDetailModalVisible(false)
        setSelectedUser(null)
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDetailModalVisible(false)
                setSelectedUser(null)
              }}
            >
              <X size={20} color="#166534" />
            </TouchableOpacity>
          </View>

          {detailLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Loading user details...</Text>
            </View>
          ) : selectedUser ? (
            <ScrollView style={styles.modalContent}>
              <View style={styles.userAvatarContainer}>
                <View style={styles.userAvatar}>
                  <UserIcon size={40} color="#10b981" />
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    selectedUser.isApproved
                      ? selectedUser.isActive
                        ? styles.activeBadge
                        : styles.inactiveBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {!selectedUser.isApproved ? "Pending" : selectedUser.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Personal Information</Text>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <UserIcon size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Full Name</Text>
                    <Text
                      style={styles.detailValue}
                    >{`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Mail size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>GUC Email</Text>
                    <Text style={styles.detailValue}>{selectedUser.gucEmail || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Hash size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>ID Number</Text>
                    <Text style={styles.detailValue}>{selectedUser.idNumber || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Phone size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Phone Number</Text>
                    <Text style={styles.detailValue}>{selectedUser.phoneNumber || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <BookOpen size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Major</Text>
                    <Text style={styles.detailValue}>{selectedUser.major || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <UserIcon size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Username</Text>
                    <Text style={styles.detailValue}>{selectedUser.username || "N/A"}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtonsContainer}>
                {!selectedUser.isApproved && (
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => {
                      handleUserApproval(selectedUser._id)
                    }}
                  >
                    <UserCheck size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Approve User</Text>
                  </TouchableOpacity>
                )}

                {selectedUser.isActive && (
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.modalDeactivateButton]}
                    onPress={() => {
                      handleUserDeactivation(selectedUser._id)
                    }}
                  >
                    <UserX size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Deactivate User</Text>
                  </TouchableOpacity>
                )}

                {!selectedUser.isActive && selectedUser.isApproved && (
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => {
                      handleUserActivation(selectedUser._id)
                    }}
                  >
                    <Check size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Activate User</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load user details</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )

  // Render Car Detail Modal
  const renderCarDetailModal = () => (
    <Modal
      visible={detailModalVisible && selectedCar !== null}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setDetailModalVisible(false)
        setSelectedCar(null)
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Car Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDetailModalVisible(false)
                setSelectedCar(null)
              }}
            >
              <X size={20} color="#166534" />
            </TouchableOpacity>
          </View>

          {detailLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Loading car details...</Text>
            </View>
          ) : selectedCar ? (
            <ScrollView style={styles.modalContent}>
              <View style={styles.userAvatarContainer}>
                <View style={styles.userAvatar}>
                  <Car size={40} color="#10b981" />
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    selectedCar.isApproved
                      ? selectedCar.isActive
                        ? styles.activeBadge
                        : styles.inactiveBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {!selectedCar.isApproved ? "Pending" : selectedCar.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Car Information</Text>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <UserIcon size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Username</Text>
                    <Text style={styles.detailValue}>{selectedCar.username || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Users size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Number of Passengers</Text>
                    <Text style={styles.detailValue}>{selectedCar.numberOfPassengers || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Battery size={18} color="#10b981" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Battery Level</Text>
                    <Text style={styles.detailValue}>
                      {selectedCar.batteryLevel ? `${selectedCar.batteryLevel}%` : "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtonsContainer}>
                {!selectedCar.isApproved && (
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => {
                      handleCarApproval(selectedCar._id)
                    }}
                  >
                    <CheckCircle size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Approve Car</Text>
                  </TouchableOpacity>
                )}

                {selectedCar.isActive && (
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.modalDeactivateButton]}
                    onPress={() => {
                      handleCarDeactivation(selectedCar._id)
                    }}
                  >
                    <XCircle size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Deactivate Car</Text>
                  </TouchableOpacity>
                )}

                {!selectedCar.isActive && selectedCar.isApproved && (
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => {
                      handleCarActivation(selectedCar._id)
                    }}
                  >
                    <Check size={20} color="#ffffff" />
                    <Text style={styles.modalActionButtonText}>Activate Car</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load car details</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )

  const userCounts = getUserCounts()
  const carCounts = getCarCounts()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Go Drives</Text>
        <View style={styles.headerRight} />
      </View>

      <Text style={styles.screenTitle}>Admin Dashboard</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "users" && styles.activeTabButton]}
          onPress={() => setActiveTab("users")}
        >
          <Users size={20} color={activeTab === "users" ? "#ffffff" : "#166534"} />
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>User Management</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "cars" && styles.activeTabButton]}
          onPress={() => setActiveTab("cars")}
        >
          <Car size={20} color={activeTab === "cars" ? "#ffffff" : "#166534"} />
          <Text style={[styles.tabText, activeTab === "cars" && styles.activeTabText]}>Car Management</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color="#64748b" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? userCounts.total : carCounts.total}</Text>
          <Text style={styles.statLabel}>{activeTab === "users" ? "Total Users" : "Total Cars"}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? userCounts.active : carCounts.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? userCounts.pending : carCounts.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.filterChips}>
        <TouchableOpacity
          style={[
            styles.chip,
            (activeTab === "users" && userFilter === "all") || (activeTab === "cars" && carFilter === "all")
              ? styles.activeChip
              : null,
          ]}
          onPress={() => (activeTab === "users" ? setUserFilter("all") : setCarFilter("all"))}
        >
          <Text
            style={[
              styles.chipText,
              (activeTab === "users" && userFilter === "all") || (activeTab === "cars" && carFilter === "all")
                ? styles.activeChipText
                : null,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            (activeTab === "users" && userFilter === "active") || (activeTab === "cars" && carFilter === "active")
              ? styles.activeChip
              : null,
          ]}
          onPress={() => (activeTab === "users" ? setUserFilter("active") : setCarFilter("active"))}
        >
          <Text
            style={[
              styles.chipText,
              (activeTab === "users" && userFilter === "active") || (activeTab === "cars" && carFilter === "active")
                ? styles.activeChipText
                : null,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            (activeTab === "users" && userFilter === "pending") || (activeTab === "cars" && carFilter === "pending")
              ? styles.activeChip
              : null,
          ]}
          onPress={() => (activeTab === "users" ? setUserFilter("pending") : setCarFilter("pending"))}
        >
          <Text
            style={[
              styles.chipText,
              (activeTab === "users" && userFilter === "pending") || (activeTab === "cars" && carFilter === "pending")
                ? styles.activeChipText
                : null,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            (activeTab === "users" && userFilter === "inactive") || (activeTab === "cars" && carFilter === "inactive")
              ? styles.activeChip
              : null,
          ]}
          onPress={() => (activeTab === "users" ? setUserFilter("inactive") : setCarFilter("inactive"))}
        >
          <Text
            style={[
              styles.chipText,
              (activeTab === "users" && userFilter === "inactive") || (activeTab === "cars" && carFilter === "inactive")
                ? styles.activeChipText
                : null,
            ]}
          >
            Inactive
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : activeTab === "users" ? (
          <FlatList
            data={getFilteredUsers()}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={getFilteredCars()}
            renderItem={renderCarItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cars found</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Render detail modals */}
      {renderUserDetailModal()}
      {renderCarDetailModal()}
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#dcfce7",
  },
  activeTabButton: {
    backgroundColor: "#10b981",
  },
  tabText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#166534",
  },
  activeTabText: {
    color: "#ffffff",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1f2937",
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: "#64748b",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterText: {
    marginLeft: 6,
    marginRight: 4,
    color: "#166534",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
  },
  statLabel: {
    fontSize: 12,
    color: "#10b981",
    marginTop: 4,
  },
  filterChips: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: "#10b981",
  },
  chipText: {
    fontSize: 12,
    color: "#64748b",
  },
  activeChipText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  listItemMain: {
    flexDirection: "row",
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  listItemLocation: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeIndicator: {
    backgroundColor: "#10b981",
  },
  pendingIndicator: {
    backgroundColor: "#f59e0b",
  },
  inactiveIndicator: {
    backgroundColor: "#ef4444",
  },
  statusText: {
    fontSize: 12,
    color: "#64748b",
  },
  listItemActions: {
    flexDirection: "row",
    position: "absolute",
    right: 16,
    top: 16,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  deactivateButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  activateButton: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  statusBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  pendingBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  inactiveBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  maintenanceBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    color: "#64748b",
  },
  floatingButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#f0fdf4",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
  userAvatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#1f2937",
  },
  actionButtonsContainer: {
    marginTop: 16,
  },
  modalActionButton: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalDeactivateButton: {
    backgroundColor: "#ef4444",
  },
  modalActionButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default AdminDashboard

