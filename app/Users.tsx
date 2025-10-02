import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateUserModal from "@/components/ui/UpdateUserModal";
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "pharmacist";
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("http://192.168.68.118:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (user: User) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${user.fullName}?`,
      [
        { text: "Cancel" },
        { text: "Delete", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await fetch(`http://192.168.68.118:5000/api/auth/${user._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(u => u._id !== user._id));
          } catch (err) { console.error(err); }
        }, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>
        
      <Text style={styles.title}>Users</Text>
      
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <View style={styles.buttons}>
              <Pressable
                style={styles.updateBtn}
                onPress={() => {
                  setEditingUser(item);
                  setUpdateModalVisible(true);
                }}
              >
                <Text style={styles.btnText}>Update</Text>
              </Pressable>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {editingUser && (
        <UpdateUserModal
          visible={updateModalVisible}
          initialData={editingUser}
          onClose={() => setUpdateModalVisible(false)}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
            setUpdateModalVisible(false);
          }}
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: '100%',
    backgroundColor: '#252525',
    alignItems: 'center'
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 20,
    padding: 8,
    zIndex: 10,
    },
    title:{
      alignSelf: 'center',
      marginTop: 35,
      marginBottom: 35,
      fontSize: 26,
      color: 'white',
      fontWeight: 'bold'
    },
  userItem: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 15, 
    backgroundColor: "#eee", 
    marginBottom: 10, 
    borderRadius: 8 
  },
  name: { 
    fontWeight: "bold", 
    fontSize: 16 },
  email: { 
    fontSize: 14, 
    color: "#555" 
  },
  role: { 
    fontSize: 14, color: "#888" },
  buttons: { flexDirection: "row", gap: 10 },
  updateBtn: { backgroundColor: "#3A8", padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: "#dc3939", padding: 8, borderRadius: 6 },
  btnText: { color: "white", fontWeight: "bold" }
});
