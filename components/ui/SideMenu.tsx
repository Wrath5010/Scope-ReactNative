import React from "react";
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Image} from "react-native";

interface MenuItem {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode; // can be <Image> or <Ionicons>
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, menuItems }) => {
  
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
                  {item.icon && <View style={styles.iconWrapper}>{item.icon}</View>}
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
              </Pressable>
            ))}
            <Pressable style={styles.logoutbtn}>
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
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  menuContainer: {
    width: '70%',
    backgroundColor: "#252525",
    paddingTop: 50,
    paddingHorizontal: 20,
    height: "100%",
  },
  menuheader:{
    fontSize: 26,
    fontWeight: "700",
    color: 'white',
    padding: 15
  },
  menuItem: {
    paddingVertical: 5,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "400",
    color: 'white',
    padding: 15,
  },
  transparentArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  icon:{
    height:50,
    resizeMode: 'contain',
  },
  logoutbtn:{

  },
  logoutText: {
    fontSize: 18,
    fontWeight: "600",
    color: '#e61717ff',
    padding: 15,
  },
  menuRow: {
  flexDirection: "row",
  alignItems: "center",
  },
  iconWrapper: {
    marginRight: 10,
  },
});
