import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  FlatList, 
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "@/components/ui/NavigationBar";
import { URL } from "./utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- TypeScript interface for notifications ---
interface NotificationItem {
  _id: string;
  medicineId?: {
    _id: string;
    name: string;
    category?: string;
    expiryDate?: string;
    stockQuantity?: number;
  };
  message: string;
  type: string;
  read: boolean;
  reactivateAt?: string | null;
  createdAt: string;
  markedBy?: { user: string; name: string }[];
}

export default function Notification() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {

    setLoading(true); 
  
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "No token found. Please log in again.");
        router.replace("/Dashboard");
        return;
      }

      const res = await fetch(`${URL}/notifications`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => Number(a.read) - Number(b.read));
        setNotifications(sorted);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch notifications");
    } finally {
      setLoading(false); 
    }
  };


  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "No token found. Please log in again.");
        router.replace("/Dashboard");
        return;
      }

      const res = await fetch(`${URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) {
        Alert.alert("Error", "Failed to mark as read");
        return;
      }

      // Refresh list and loading state will be handled inside fetchNotifications
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };


  // Search logic — safe for missing fields
  const filteredNotifications = notifications.filter((n) => {
    const keyword = search.toLowerCase();
    const message = n.message?.toLowerCase() || "";
    const type = n.type?.toLowerCase() || "";
    const medicineName = n.medicineId?.name?.toLowerCase() || "";

    return (
      message.includes(keyword) ||
      type.includes(keyword) ||
      medicineName.includes(keyword)
    );
  });

  
  useEffect(() => {
    let isMounted = true;

    const fetchLoop = async () => {
      if (!isMounted) return;

      await fetchNotifications(); // fetch new notifications

      // schedule next fetch
      setTimeout(fetchLoop, 30000); // 30 seconds interval
    };

    fetchLoop(); // start first fetch

    return () => {
      isMounted = false; // stops further fetches on unmount
    };
  }, []);


  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <View style={styles.container}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Notifications</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.search}
            placeholder="Search message, type, or medicine"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />

          {/* Loading */}
          {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

          {/* Notification List */}
          <FlatList
            contentContainerStyle={{ paddingBottom: 300 }}
            data={filteredNotifications}
            keyExtractor={(item) => item._id}
            refreshing={loading}
            onRefresh={fetchNotifications}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.notificationCard,
                  item.read && { backgroundColor: "white" },
                ]}
              >
                <Text style={styles.message}>
                 {item.message}
                </Text>
                <Text style={styles.type}>Type: {item.type}</Text>
                
                {!item.read && (
                  <Pressable
                    style={styles.readBtn}
                    onPress={() => markAsRead(item._id)}
                  >
                    <Text style={{ color: "green", fontWeight: "bold" }}>Mark as Read</Text>
                  </Pressable>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>
                No notifications found
              </Text>
            }
          />
        </View>
      </View>

      <NavigationBar />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    marginTop: 35,
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    width: "85%",
    marginTop: 20,
    gap: 10
  },
  search: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  notificationCard: {
    width: "100%",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  message: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
  type: {
    color: "grey",
    fontSize: 13,
  },
  readBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "flex-end",
  },
});
