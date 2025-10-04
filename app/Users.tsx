import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateUserModal from "@/components/ui/UpdateUserModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "pharmacist";
}

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://192.168.68.119:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user: User) => {
    if (user.role === "admin") {
      Alert.alert("Action denied", "Admin cannot be deleted.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) return;

              const res = await fetch(
                `http://192.168.68.119:5000/api/users/${user._id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to delete user");
              }

              setUsers(users.filter((u) => u._id !== user._id));
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#252525" }}>
      <View style={styles.container}>
        <Pressable
          onPress={() => router.replace("/Dashboard")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Users</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View>
                <Text style={styles.username}>{item.name}</Text>
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
                  <Text style={styles.btnTextupdate}>Update</Text>
                </Pressable>

                {item.role !== "admin" && (
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        />

        {/*If enough time, add a previous pass THEN New password */}
        {editingUser && (
          <UpdateUserModal
            visible={updateModalVisible}
            initialData={editingUser}
            onClose={() => setUpdateModalVisible(false)}
            onSave={async (updatedUser) => {
              try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;

                // Call backend to update user
                const res = await fetch(
                  `http://192.168.68.119:5000/api/users/${updatedUser._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      fullName: updatedUser.fullName,
                      email: updatedUser.email,
                      ...(updatedUser.password
                        ? { password: updatedUser.password }
                        : {}),
                    }),
                  }
                );

                const data = await res.json();
                if (!res.ok) {
                  Alert.alert("Error", data.message || "Failed to update user");
                  return;
                }

                setUsers(
                  users.map((u) =>
                    u._id === updatedUser._id
                      ? { ...u, fullName: updatedUser.fullName, email: updatedUser.email }
                      : u
                  )
                );
                setUpdateModalVisible(false);
              } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to update user");
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    alignSelf: 'center',
      marginTop: 35,
      marginBottom: 35,
      fontSize: 26,
      color: 'white',
      fontWeight: 'bold'
  },
  userItem: {
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 15,
    width: "95%"
  },
  username: {
    fontWeight: "700",
    fontSize: 17,
    color: "#222222",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  role: {
    fontSize: 13,
    color: "#00c8ff",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  updateBtn: {
    backgroundColor: "#e6f8ff",
    borderWidth: 1,
    borderColor: "#00c8ff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnTextupdate: {
    color: "#00a6e8",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#dc3939",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
