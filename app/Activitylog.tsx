import React, { useState, useEffect, useMemo } from "react";
import { 
  View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationBar from "@/components/ui/NavigationBar";
import { URL } from "./utils/api";

// User type for populated userId
interface ActivityUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Medicine details in activity
interface MedicineDetails {
  name?: string;
  category?: string;
  price?: number;
  dosage?: string;
  quantity?: number;
  manufacturer?: string;
  stockQuantity?: number;
  expiryDate?: string;
}

// Activity log interface
interface Activity {
  _id: string;
  userId: ActivityUser | string | null; // may be null
  action: string;
  entity: string;
  entityId: string;
  details?: MedicineDetails; // optional medicine details
  createdAt: string;
}

export default function Activitylog() {
  const router = useRouter();
  
  const [activity, setActivity] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "No token found. Please log in again.");
        router.replace("/Dashboard");
        return;
      }

      const response = await fetch(`${URL}/Activity`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse response as JSON: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setActivity(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetching Activity error:", err.message);
        Alert.alert("Error", "Failed to fetch activity logs: " + err.message);
      } else {
        Alert.alert("Error", "An unknown error occurred while fetching activity logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Filter + sort activity logs
  const displayedData = useMemo(() => {
    let result = [...activity];

    // Filter by username
    if (searchQuery.trim() !== "") {
      result = result.filter((item) => {
        const username =
          item.userId && typeof item.userId === "object"
            ? item.userId.name
            : item.userId || "Unknown User";
        return username.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filter by date
    const now = new Date();
    result = result.filter((item) => {
      const created = new Date(item.createdAt);
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);


      switch (dateFilter) {
        case "Today": return diff < 1;
        case "Yesterday": return diff >= 1 && diff < 2;
        case "This Week": return diff < 7;
        case "2 Weeks": return diff < 14;
        case "1 Month": return diff < 30;
        case "3 Months": return diff < 90;
        default: return true;
      }
    });

    // Sort newest first
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return result;
  }, [activity, searchQuery, dateFilter]);

  const dateFilters = ["All", "Today", "Yesterday", "This Week", "2 Weeks", "1 Month", "3 Months"];

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Activity Log</Text>

        <View style={styles.SecondCont}>


          {/* Search */}
          <TextInput
            placeholder="Search by Username"
            placeholderTextColor="#888"
            style={styles.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Date Filter */}
          <Pressable
            style={styles.filter}
            onPress={() => {
              const nextIndex = (dateFilters.indexOf(dateFilter) + 1) % dateFilters.length;
              setDateFilter(dateFilters[nextIndex]);
            }}
          >
            <Text style={styles.btnText}>Date: {dateFilter}</Text>
          </Pressable>

          {/* Loading */}
          {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

          {/* Activity List */}
          <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 300 }}
          data={displayedData}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            const username =
              item.userId && typeof item.userId === "object"
                ? item.userId.name
                : item.userId || "Removed User";

            // Determine color based on action keyword
            const getActionColor = (action: string) => {
              const lower = action.toLowerCase();
              if (lower.includes("created")) return "#4CAF50"; 
              if (lower.includes("updated")) return "#2196F3"; 
              if (lower.includes("deleted")) return "#F44336"; 
              return "black"; 
            };

            return (
              <View style={styles.activityItem}>
                <Text style={styles.username}>User: {username}</Text>
                <Text style={[styles.action, { color: getActionColor(item.action) }]}>
                  Action: {item.action}
                </Text>
                {item.details && (
                  <View style={{ marginTop: 4 }}>
                    {item.details.name && <Text style={styles.details}>Name: {item.details.name}</Text>}
                    {item.details.category && <Text style={styles.details}>Category: {item.details.category}</Text>}
                    {item.details.price !== undefined && <Text style={styles.details}>Price: ${item.details.price}</Text>}
                    {item.details.dosage && <Text style={styles.details}>Dosage: {item.details.dosage}</Text>}
                    {item.details.quantity !== undefined && <Text style={styles.details}>Quantity: {item.details.quantity}</Text>}
                    {item.details.manufacturer && <Text style={styles.details}>Manufacturer: {item.details.manufacturer}</Text>}
                    {item.details.stockQuantity !== undefined && <Text style={styles.details}>Stock: {item.details.stockQuantity}</Text>}
                    {item.details.expiryDate && (
                      <Text style={styles.details}>
                        Expiry: {new Date(item.details.expiryDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                )}
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            );
          }}
        />
        </View>
      </View>

      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: "100%", 
    backgroundColor: "#252525", 
    alignItems: "center" 
  },
  backBtn: { 
    position: "absolute", 
    top: 28, 
    left: 20, 
    padding: 8, 
    zIndex: 10 
  },
  title: { 
    alignSelf: "center", 
    marginTop: 35, 
    fontSize: 26, 
    color: "white", 
    fontWeight: "bold" 
  },
  search: { 
    height: 50, 
    width: "100%", 
    backgroundColor: "white", 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    marginTop: 15 
  },
  SecondCont: { 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 10, 
    marginTop: 20, 
    width: "85%" 
  },
  filter: { 
    height: 50, 
    width: "100%", 
    backgroundColor: "#3A3A3A", 
    borderRadius: 12, 
    justifyContent: "center" 
  },
  btnText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "500", 
    textAlign: "left", 
    paddingHorizontal: 12 
  },
  activityItem: { 
    backgroundColor: "white", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    width: "100%" 
  },
  username: { 
    fontSize: 16, 
    fontWeight: "500", 
    marginBottom: 4 
  },
  action: { 
    fontSize: 14, 
    marginBottom: 2,
  },
  details: { 
    fontSize: 12, 
    marginBottom: 2,
    color: 'grey'
  },
  date: { 
    fontSize: 14, 
    marginTop: 4 
  },
});
