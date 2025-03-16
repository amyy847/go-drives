"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from "react-native"
import {
  Users,
  Car,
  ChevronDown,
  Search,
  UserCheck,
  UserX,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Filter,
  ArrowLeft,
} from "lucide-react-native"

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", location: "New York" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "pending", location: "Los Angeles" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", status: "active", location: "Chicago" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", status: "inactive", location: "Miami" },
]

const mockCars = [
  { id: 1, model: "Tesla Model 3", plate: "ABC123", status: "active", driver: "John Doe" },
  { id: 2, model: "Toyota Prius", plate: "XYZ789", status: "maintenance", driver: "Jane Smith" },
  { id: 3, model: "Ford Mustang", plate: "DEF456", status: "pending", driver: "Mike Johnson" },
  { id: 4, model: "Chevrolet Bolt", plate: "GHI789", status: "active", driver: "Sarah Williams" },
]

const AdminDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("users")
  const [userFilter, setUserFilter] = useState("all")
  const [carFilter, setCarFilter] = useState("all")

  // Filter users based on selected filter
  const filteredUsers = mockUsers.filter((user) => {
    if (userFilter === "all") return true
    return user.status === userFilter
  })

  // Filter cars based on selected filter
  const filteredCars = mockCars.filter((car) => {
    if (carFilter === "all") return true
    return car.status === carFilter
  })

  const renderUserItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemMain}>
        <View style={styles.listItemIcon}>
          <Users size={20} color="#10b981" />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSubtitle}>{item.email}</Text>
          <Text style={styles.listItemLocation}>{item.location}</Text>
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Eye size={18} color="#10b981" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          {item.status === "pending" ? <UserCheck size={18} color="#10b981" /> : <UserX size={18} color="#ef4444" />}
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "active"
            ? styles.activeBadge
            : item.status === "pending"
              ? styles.pendingBadge
              : styles.inactiveBadge,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  )

  const renderCarItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemMain}>
        <View style={styles.listItemIcon}>
          <Car size={20} color="#10b981" />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{item.model}</Text>
          <Text style={styles.listItemSubtitle}>Plate: {item.plate}</Text>
          <Text style={styles.listItemLocation}>Driver: {item.driver}</Text>
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MapPin size={18} color="#10b981" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          {item.status === "pending" ? (
            <CheckCircle size={18} color="#10b981" />
          ) : (
            <XCircle size={18} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "active"
            ? styles.activeBadge
            : item.status === "pending"
              ? styles.pendingBadge
              : item.status === "maintenance"
                ? styles.maintenanceBadge
                : styles.inactiveBadge,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
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
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color="#166534" />
          <Text style={styles.filterText}>Filter</Text>
          <ChevronDown size={16} color="#166534" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? "42" : "38"}</Text>
          <Text style={styles.statLabel}>{activeTab === "users" ? "Total Users" : "Total Cars"}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? "36" : "32"}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTab === "users" ? "6" : "4"}</Text>
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

        {activeTab === "cars" && (
          <TouchableOpacity
            style={[styles.chip, carFilter === "maintenance" ? styles.activeChip : null]}
            onPress={() => setCarFilter("maintenance")}
          >
            <Text style={[styles.chipText, carFilter === "maintenance" ? styles.activeChipText : null]}>
              Maintenance
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {activeTab === "users" ? (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredCars}
            renderItem={renderCarItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
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
    marginRight: 8,
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
  statusText: {
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
})

export default AdminDashboard

