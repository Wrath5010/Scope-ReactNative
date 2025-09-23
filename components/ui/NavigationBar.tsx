import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SideMenu from "@/components/ui/SideMenu";
import { useRouter, usePathname } from "expo-router";

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  // Side menu items (with images)
  const menuItems = [
    {
      label: "Add Medicine",
      onPress: () => router.push("/AddMedicine"),
      icon: (
        <Image
          source={require("@/assets/images/add-medicine.png")}
          style={styles.menuImages}
        />
      ),
    },
    {
      label: "Delete Medicine",
      onPress: () => router.push("/DeletePage"),
      icon: (
        <Image
          source={require("@/assets/images/Delete-medicine.png")}
          style={styles.menuImages}
        />
      ),
    },
    {
      label: "Inventory",
      onPress: () => router.push("/InventoryPage"),
      icon: (
        <Image
          source={require("@/assets/images/Inventory.png")}
          style={styles.menuImages}
        />
      ),
    },
    {
      label: "Notification",
      onPress: () => router.push("/Notification"),
      icon: (
        <Image
          source={require("@/assets/images/Notification.png")}
          style={styles.menuImages}
        />
      ),
    },
    {
      label: "Statistics",
      onPress: () => router.push("/Statistics"),
      icon: (
        <Image
          source={require("@/assets/images/Statistics.png")}
          style={styles.menuImages}
        />
      ),
    },
    {
      label: "Activity Log",
      onPress: () => router.push("/Activitylog"),
      icon: (
        <Image
          source={require("@/assets/images/Activity-Log.png")}
          style={styles.menuImages}
        />
      ),
    },
  ];

  // Bottom navbar helper (optional, keep disabled states if needed)
  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.container}>
      {/* Inventory */}
      <Pressable
        onPress={() => {
          if (!isActive("/InventoryPage")) router.push("/InventoryPage");
        }}
        disabled={isActive("/InventoryPage")}
        style={({ pressed }) => [
          styles.iconWrapper,
          isActive("/InventoryPage") && styles.disabledIcon,
          pressed && !isActive("/InventoryPage") && { opacity: 0.5 },
        ]}
      >
        <FontAwesome5 name="clipboard-list" size={24} color="white" />
      </Pressable>

      {/* Add */}
      <Pressable onPress={() => {
          if (!isActive("/AddMedicine")) router.push("/AddMedicine");
        }}
        disabled={isActive("/AddMedicine")}
        style={({ pressed }) => [
          styles.iconWrapper,
          isActive("/AddMedicine") && styles.disabledIcon,
          pressed && !isActive("/AddMedicine") && { opacity: 0.5 },
        ]}>
        <Ionicons name="add-circle" size={24} color="white" />
      </Pressable>

      {/* Home */}
      <Pressable
        onPress={() => {
          if (!isActive("/")) router.push("/Dashboard");
        }}
        disabled={isActive("/")}
        style={({ pressed }) => [
          styles.iconWrapper,
          isActive("/") && styles.disabledIcon,
          pressed && !isActive("/") && { opacity: 0.5 },
        ]}
      >
        <Ionicons name="home" size={24} color="white" />
      </Pressable>

      {/* Delete */}
      <Pressable onPress={() => {
          if (!isActive("/DeletePage")) router.push("/DeletePage");
        }}
        disabled={isActive("/DeletePage")}
        style={({ pressed }) => [
          styles.iconWrapper,
          isActive("/DeletePage") && styles.disabledIcon,
          pressed && !isActive("/DeletePage") && { opacity: 0.5 },
        ]}>
        <MaterialIcons name="delete" size={24} color="white" />
      </Pressable>

      {/* Hamburger Menu */}
      <Pressable onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={24} color="white" />
      </Pressable>

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        menuItems={menuItems} // Only parsed here
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
  iconWrapper: {
    opacity: 1,
  },
  disabledIcon: {
    opacity: 0.3,
  },
  menuImages: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
