import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Image, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SideMenu from "@/components/ui/SideMenu";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userRole, setUserRole] = useState("user");

  // Load user role from AsyncStorage
  useEffect(() => {
    const loadUserRole = async () => {
      const storedUser = await AsyncStorage.getItem("userInfo");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      }
    };
    loadUserRole();
  }, []);

  // Side menu items (with icons)
  const menuItems = [
    { label: "Add Medicine", onPress: () => router.push("/AddMedicine"), icon: require("@/assets/images/add-medicine.png") },
    { label: "Delete Medicine", onPress: () => router.push("/InventoryPage?deletemode=true"), icon: require("@/assets/images/Delete-medicine.png") },
    { label: "Inventory", onPress: () => router.push("/InventoryPage"), icon: require("@/assets/images/Inventory.png") },
    { label: "Notification", onPress: () => router.push("/Notification"), icon: require("@/assets/images/Notification.png") },
    { label: "Statistics", onPress: () => router.push("/Statistics"), icon: require("@/assets/images/Statistics.png") },
    { label: "Activity Log", onPress: () => router.push("/Activitylog"), icon: require("@/assets/images/Activity-Log.png") },
  ];

  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.container}>
      {/* Inventory */}
      <Pressable
        onPress={() => !isActive("/InventoryPage") && router.push("/InventoryPage")}
        disabled={isActive("/InventoryPage")}
        style={({ pressed }) => [{ opacity: pressed && !isActive("/InventoryPage") ? 0.5 : 1 }]}
      >
        <FontAwesome5 name="clipboard-list" size={24} color="white" />
      </Pressable>

      {/* Add */}
      <Pressable
        onPress={() => !isActive("/AddMedicine") && router.push("/AddMedicine")}
        disabled={isActive("/AddMedicine")}
        style={({ pressed }) => [{ opacity: pressed && !isActive("/AddMedicine") ? 0.5 : 1 }]}
      >
        <Ionicons name="add-circle" size={24} color="white" />
      </Pressable>

      {/* Home */}
      <Pressable
        onPress={() => !isActive("/Dashboard") && router.push("/Dashboard")}
        disabled={isActive("/Dashboard")}
        style={({ pressed }) => [{ opacity: pressed && !isActive("/Dashboard") ? 0.5 : 1 }]}
      >
        <Ionicons name="home" size={24} color="white" />
      </Pressable>

      {/* Hamburger Menu */}
      <Pressable onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={24} color="white" />
      </Pressable>

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        menuItems={menuItems}
        userRole={userRole}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#252525",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  menuImages: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
