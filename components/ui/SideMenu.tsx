import React from "react";
import { View, Text, Pressable, StyleSheet, Modal, ScrollView, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface MenuItem {
  label: string;
  onPress: () => void;
  icon?: any; // pass require("@/assets/...") here
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  userRole?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, menuItems, userRole }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); 
      onClose();
      router.replace("/StartUp");
    } catch (err) {
      console.error("Logout failed:", err);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleCreateUser = () => {
    if (userRole?.toLowerCase() === "admin") {
      onClose();
      router.push("/RegisterUser");
    } else {
      //incase if the actions are visible
      Alert.alert("Access Denied", "Only admins can create new users.");
    }
  };


  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuheader}>Menu</Text>
          <ScrollView>
            {menuItems.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                <View style={styles.menuRow}>
                  {item.icon && <Image source={item.icon} style={styles.icon} />}
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
              </Pressable>
            ))}

            {/* Show Create User ONLY if admin */}
            {["admin", "superadmin"].includes(userRole?.toLowerCase() || "") && (
              <Pressable style={styles.menuItem} onPress={handleCreateUser}>
                <View style={styles.menuRow}>
                  <Image source={require("@/assets/images/new-user.png")} style={styles.icon}></Image>
                  <Text style={[styles.menuText, { color: "#00c8ff" }]}>Create User</Text>
                </View>
              </Pressable>
            )}

            {["admin", "superadmin"].includes(userRole?.toLowerCase() || "") && (
              <Pressable style={styles.menuItem} onPress={() => router.push("/Users")}>
                <View style={styles.menuRow}>
                  <Image source={require("@/assets/images/users.png")} style={styles.icon}></Image>
                  <Text style={[styles.menuText, { color: "#00c8ff" }]}>Users</Text>
                </View>
              </Pressable>
            )}

            <Pressable style={styles.logoutbtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </ScrollView>
        </View>
        <View style={styles.transparentArea} />
      </Pressable>
    </Modal>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row" },
  menuContainer: {
    width: "70%",
    backgroundColor: "#252525",
    paddingTop: 50,
    paddingHorizontal: 20,
    height: "100%",
  },
  menuheader: { 
    fontSize: 26, 
    fontWeight: "700", 
    color: "white", 
    padding: 15 
  },
  menuItem: { 
    paddingVertical: 5 
  },
  menuText: { 
    fontSize: 18, 
    fontWeight: "400", 
    color: "white", 
    padding: 15 
  },
  menuRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  icon: { 
    width: 35, 
    height: 35, 
    marginRight: 10, 
    resizeMode: "contain" 
  },
  transparentArea: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.42)" 
  },
  logoutbtn: {},
  logoutText: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#e61717ff", 
    padding: 15 
  },
});
