import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SideMenu from "@/components/ui/SideMenu";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const userName = user?.name === "admin" ? "Admin" : user?.name || "User";

  // Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userInfo");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }
    };
    loadUser();
  }, []);

  const menuItems = [
    { label: "Add Medicine", onPress: () => router.push("/AddMedicine"), icon: require("@/assets/images/add-medicine.png") },
    { label: "Delete Medicine", onPress: () => router.push("/InventoryPage?deletemode=true"), icon: require("@/assets/images/Delete-medicine.png") },
    { label: "Inventory", onPress: () => router.push("/InventoryPage"), icon: require("@/assets/images/Inventory.png") },
    { label: "Notification", onPress: () => router.push("/Notification"), icon: require("@/assets/images/Notification.png") },
    { label: "Statistics", onPress: () => router.push("/Statistics"), icon: require("@/assets/images/Statistics.png") },
    { label: "Activity Log", onPress: () => router.push("/Activitylog"), icon: require("@/assets/images/Activity-Log.png") },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <View style={styles.container}>

        {/* Header Row: hamburger + logo */}
        <View style={styles.rowcontainer}>
          {/* Left: Hamburger */}
          <Pressable style={styles.menubtn} onPress={() => setMenuVisible(true)}>
            <Image source={require("@/assets/images/Hamburger-menu.png")} style={styles.menu} />
          </Pressable>

          {/* Right: Logo */}
          <Image style={styles.logo} source={require("@/assets/images/logo.png")} />
        </View>

        {/* Header text block */}
        <View style={styles.headerText}>
          <Text style={styles.h1}>Welcome, {userName}</Text>
          <Text style={styles.p}>Dashboard</Text>
        </View>

        {/* Side Menu */}
        <SideMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          menuItems={menuItems}
          userRole={user?.role || "user"}
        />

        {/* Quick action boxes */}
        <View style={styles.row}>
          <Pressable style={styles.boxes} onPress={() => router.push("/AddMedicine")}>
            <Image source={require("@/assets/images/add-medicine.png")} style={styles.icons} />
            <Text style={styles.textbox}>Add medicine</Text>
          </Pressable>

          <Pressable style={styles.boxes} onPress={() => router.push("/InventoryPage?deletemode=true")}>
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
  container: { 
    flex: 1, 
    backgroundColor: "#252525",  
  },
  rowcontainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: '6%',
    width: "100%"
  },
  menubtn: { 
    padding: 8,
  },
  menu: { 
    width: 28, 
    height: 28, 
    resizeMode: "contain"
  },
  headerText: {
    marginTop: 8,
    paddingHorizontal: '7%',
    marginBottom: 10
  },
  h1: { 
    color: "white", 
    fontSize: 26, 
    fontWeight: "bold" 
  },
  p: { 
    color: "white", 
    fontSize: 14 
  },
  logo: { 
    width: 120, 
    height: 120, 
    resizeMode: "contain", 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between",  
    padding: 10,
    paddingHorizontal: 20
  },
  boxes: { 
    width: width * 0.40,     
    aspectRatio: 0.9,          
    borderColor: "white", 
    borderWidth: 2, 
    borderRadius: 15, 
    alignItems: "center", 
    justifyContent: "center",
    gap: 10, 
    padding: 16,
  },
  textbox: { 
    color: "white", 
    fontSize: 14, 
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,          
  },
  icons: { 
    width: "70%",            
    height: "70%", 
    resizeMode: "contain", 
  },
});
