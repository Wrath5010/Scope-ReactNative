import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import NavigationBar from "@/components/ui/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Activity{
  _id: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
}

export default function Activitylog() {
  const router = useRouter();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [datesort, setDateSort] = useState("All")

  const [activity, setActivity] = useState<Activity[]>([])

  const fetchActivityLogs = async () => {
    try {
      const token = await AsyncStorage.getItem("Token");
      const headers: Record<string, string> = {"Content-Type": "application/json"};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch("http://192.168.68.103/api/Activity", {headers});
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
    } catch (err:unknown) {
      if (err instanceof Error) {
        console.error("Fetching Activity error:", err.message);
      } else{
        Alert.alert("Error", "An unknown error occured while fetching medicines.");
      }
    }
  };

  useEffect(() => { fetchActivityLogs(); }, []);

  const displayedData = useMemo(() => {
  let result = [...activity];

   // Search function
   if (searchQuery.trim() !== "") {
    result = result.filter((item) =>
      item.userId.toLowerCase().includes(searchQuery.toLowerCase())
    )
   }

   switch (datesort) {
    case "Today":
      result.sort(
        (a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
   }
  
   return result;
  }, [searchQuery]);

  return (
    <SafeAreaView style={{backgroundColor: '#252525'}}>
    <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        
        <Text style={styles.title}>Activity Log</Text>
      
        <View style={styles.SecondCont}>
          {/*IF not admin, no search and only date section. Self track only for pharmacists*/}
          <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          style={styles.search}
          />

          {/*Today, Yesterday, This week, 2 weeks, a month and 3 months only */}
          <Pressable style={styles.filter}>
            <Text style={styles.btnText}>Date: </Text>
          </Pressable>


          {/*FlatList for users*/}
          <FlatList
            style={{ marginTop: 20, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 300 }}
            data={displayedData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.activityItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.username}>User: {item.userId}</Text>
                  <Text style={styles.action}>Action: {item.action}</Text>
                  {item.details && <Text style={styles.details}>Details: {item.details}</Text>}
                  <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          />

        </View>

    </View>
    <NavigationBar></NavigationBar>
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
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold'
  },
  search:{
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
    justifyContent: "center", 
  },
  sort: { 
    flex: 1, 
    height: 50, 
    backgroundColor: "#3A3A3A", 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  btnText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "500", 
    textAlign: "left",
    paddingHorizontal: 12, 
  },
  activityItem: {
  backgroundColor: "#3A3A3A",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  width: "100%",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},
username: {
  fontSize: 16,
  fontWeight: "600",
  color: "white",
  marginBottom: 4,
},
action: {
  fontSize: 14,
  color: "#FFD700",
  marginBottom: 2,
},
details: {
  fontSize: 13,
  color: "#ccc",
  marginBottom: 2,
},
date: {
  fontSize: 12,
  color: "#aaa",
  marginTop: 4,
},

});