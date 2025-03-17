"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from "react-native";
import {
  Users,
  Car,
  ArrowLeft,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
} from "lucide-react-native";

const API_BASE_URL = "http://192.168.100.88:5000/api";

const AdminDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [userFilter, setUserFilter] = useState("all");
  const [carFilter, setCarFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCars();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await axios.get(`${API_BASE_URL}/user/`);
      console.log("Response:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/car/`);
      console.log("Cars response:", response.data);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleUserAction = async (_id, isApproved) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${_id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error("Error updating user approval:", error);
    }
  };

  const handleCarAction = async (_id, isApproved) => {
    try {
      const response = await fetch(`${API_BASE_URL}/car/${_id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      if (response.ok) fetchCars();
    } catch (error) {
      console.error("Error updating car approval:", error);
    }
  };

  const filteredUsers = users.filter((user) => userFilter === "all" || user.isApproved === userFilter);
  const filteredCars = cars.filter((car) => carFilter === "all" || car.isApproved === carFilter);

  const renderUserItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.firstName} {item.lastName} - {item.gucEmail}</Text>
      <TouchableOpacity onPress={() => handleUserAction(item._id, item.isApproved)}>
        {item.isApproved ? <UserX size={18} color="#ef4444" /> : <UserCheck size={18} color="#10b981" />}
      </TouchableOpacity>
    </View>
  );

  const renderCarItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.username}</Text>
      <TouchableOpacity onPress={() => handleCarAction(item._id, item.isApproved)}>
        {item.isApproved ? <XCircle size={18} color="#ef4444" /> : <CheckCircle size={18} color="#10b981" />}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Go Drives Admin</Text>
      </View>
      <View>
        {activeTab === "users" ? (
          <FlatList data={filteredUsers} renderItem={renderUserItem} keyExtractor={(item) => item._id.toString()} />
        ) : (
          <FlatList data={filteredCars} renderItem={renderCarItem} keyExtractor={(item) => item._id.toString()} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0fdf4" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  appTitle: { fontSize: 20, fontWeight: "bold", color: "#166534", marginLeft: 16 },
  listItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", flexDirection: "row", justifyContent: "space-between" },
});

export default AdminDashboard;
