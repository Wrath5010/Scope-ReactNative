import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SideMenu from "@/components/ui/SideMenu";

export default function Dashboard() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const userName = user?.role === "admin" ? "Admin" : user?.name || "User";

  // Load user from AsyncStorage
  useEffect(() => {
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("userInfo");
    console.log("AsyncStorage.userInfo raw:", storedUser);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("parsed user:", parsed);
      setUser(parsed);
      

    }
  };
  loadUser();
}, []);


  const menuItems = [
    { label: "Add Medicine", onPress: () => router.push("/AddMedicine"), icon: require("@/assets/images/add-medicine.png") },
    { label: "Delete Medicine", onPress: () => router.push("/DeletePage"), icon: require("@/assets/images/Delete-medicine.png") },
    { label: "Inventory", onPress: () => router.push("/InventoryPage"), icon: require("@/assets/images/Inventory.png") },
    { label: "Notification", onPress: () => router.push("/Notification"), icon: require("@/assets/images/Notification.png") },
    { label: "Statistics", onPress: () => router.push("/Statistics"), icon: require("@/assets/images/Statistics.png") },
    { label: "Activity Log", onPress: () => router.push("/Activitylog"), icon: require("@/assets/images/Activity-Log.png") },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <View style={styles.container}>
        <View style={{ paddingLeft: 10, gap: 20 }}>
          <View style={styles.rowcontainer}>
            <Pressable style={styles.menubtn} onPress={() => setMenuVisible(true)}>
              <Image source={require("@/assets/images/Hamburger-menu.png")} style={styles.menu} />
            </Pressable>

            <SideMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            menuItems={menuItems}
            userRole={user?.role || "user"}
            />

            <Image style={styles.logo} source={require("@/assets/images/icon.png")} />
          </View>

          <View style={styles.header}>
            <Text style={styles.h1}>Welcome, {userName}</Text>
            <Text style={styles.p}>Dashboard</Text>
          </View>
        </View>

        {/* Quick action boxes */}
        <View style={styles.row}>
          <Pressable style={styles.boxes} onPress={() => router.push("/AddMedicine")}>
            <Image source={require("@/assets/images/add-medicine.png")} style={styles.icons} />
            <Text style={styles.textbox}>Add medicine</Text>
          </Pressable>

          <Pressable style={styles.boxes} onPress={() => router.push("/DeletePage")}>
            <Image source={require("@/assets/images/Delete-medicine.png")} style={styles.icons} />
            <Text style={styles.textbox}>Delete medicine</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable style={styles.boxes} onPress={() => router.push("/Notification")}>
            <Image source={require("@/assets/images/Notification.png")} style={styles.icons} />
            <Text style={styles.textbox}>Notification</Text>
          </Pressable>

          <Pressable style={styles.boxes} onPress={() => router.push("/InventoryPage")}>
            <Image source={require("@/assets/images/Inventory.png")} style={styles.icons} />
            <Text style={styles.textbox}>Inventory</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable style={styles.boxes} onPress={() => router.push("/Statistics")}>
            <Image source={require("@/assets/images/Statistics.png")} style={styles.icons} />
            <Text style={styles.textbox}>Statistics</Text>
          </Pressable>

          <Pressable style={styles.boxes} onPress={() => router.push("/Activitylog")}>
            <Image source={require("@/assets/images/Activity-Log.png")} style={styles.icons} />
            <Text style={styles.textbox}>Activity Log</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#252525", paddingTop: 30 },
  rowcontainer: { height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 20 },
  logo: { height: 130, resizeMode: "contain", marginLeft: 40 },
  menubtn: { width: "0%", alignItems: "center" },
  menu: { height: 30, resizeMode: "contain", justifyContent: "center" },
  header: { height: 50, paddingLeft: 10, marginBottom: 10 },
  h1: { color: "white", fontSize: 26, fontWeight: "bold" },
  p: { color: "white", fontSize: 14 },
  row: { flexDirection: "row", justifyContent: "space-around", padding: 10 },
  boxes: { height: 180, width: 160, borderColor: "white", borderWidth: 2, borderRadius: 15, alignItems: "center", gap: 10, padding: 20 },
  textbox: { color: "white", fontSize: 14, fontWeight: "bold" },
  icons: { height: 100, resizeMode: "center" },
  menuimages: { width: 30, height: 30 },
});
