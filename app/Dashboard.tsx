import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SideMenu from "@/components/ui/SideMenu";

export default function Dashboard() {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const menuItems = [
    {label: "Add Medicine", onPress: () => router.push("/AddMedicine"), 
    icon: (
      <Image
        source={require("@/assets/images/add-medicine.png")}
        style={styles.menuimages}
      />)
    },
    {label: "Delete Medicine", onPress: () => router.push("/DeletePage"),
    icon: (
      <Image
        source={require("@/assets/images/Delete-medicine.png")}
        style={styles.menuimages}
      />)},
    { label: "Inventory", onPress: () => router.push("/InventoryPage"), 
    icon: (
        <Image
        source={require("@/assets/images/Inventory.png")}
        style={styles.menuimages}
      />)
    },
    { label: "Notification", onPress: () => router.push("/Notification"),
    icon: (
        <Image source={require("@/assets/images/Notification.png")}
        style={styles.menuimages}/>
    )
     },
    { label: "Statistics", onPress: () => router.push("/Statistics"),
    icon: (
        <Image source={require("@/assets/images/Statistics.png")}
        style={styles.menuimages}/>
    )
     },
     { label: "Activity Log", onPress: () => router.push("/Activitylog"),
    icon: (
        <Image source={require("@/assets/images/Activity-Log.png")}
        style={styles.menuimages}/>
    )
     },
  ];

  return (
    <SafeAreaView style={{backgroundColor: '#252525'}}>
    <View style={styles.container}>

        <View style={{paddingLeft: 10, gap: 20}}>
            <View style={styles.rowcontainer}>

                {/* fix the styling here, pressable and sidemenu should be group in one container (column), then image should seperated. basically a row container -> 2 child container -> child 1 should be column inside & child 2 is just itself with minor adjustsments*/}
                <Pressable style={styles.menubtn} onPress={() => setMenuVisible(true)}>
                <Image source={require('@/assets/images/Hamburger-menu.png')} style={styles.menu}/>
                </Pressable>

                <SideMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                menuItems={menuItems}
                />

                <Image style={styles.logo} source={require('@/assets/images/icon.png')}></Image>
            </View>

            <View style={styles.header}>
                <Text style={styles.h1}>Welcome, User</Text>
                <Text style={styles.p}>Dashboard</Text>
            </View>
        </View>


        <View style={{flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,}}>
            <Pressable style={styles.boxes} onPress={() => router.push('/AddMedicine')}>
                <Image source={require('@/assets/images/add-medicine.png')} style={styles.icons}/>
                <Text style={styles.textbox}>Add medicine</Text>
            </Pressable>

            <Pressable style={styles.boxes} onPress={() => router.push("/DeletePage")}>
                <Image source={require('@/assets/images/Delete-medicine.png')} style={styles.icons}></Image>
                <Text style={styles.textbox}>Delete medicine</Text>
            </Pressable>
        </View>
        <View style={{flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,}}>

            <Pressable style={styles.boxes} onPress={() => router.push("/Notification")}>
                <Image source={require('@/assets/images/Notification.png')} style={styles.icons}></Image>
                <Text style={styles.textbox}>Notification</Text>
            </Pressable>

            <Pressable style={styles.boxes} onPress={() => router.push('/InventoryPage')}>
                <Image source={require('@/assets/images/Inventory.png')} style={styles.icons}></Image>
                <Text style={styles.textbox}>Inventory</Text>
            </Pressable>

        </View>
        <View style={{flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,}}>

            <Pressable style={styles.boxes} onPress={() => router.push("/Statistics")}>
                <Image source={require('@/assets/images/Statistics.png')} style={styles.icons}></Image>
                <Text style={styles.textbox}>Statistics</Text>
            </Pressable>

            <Pressable style={styles.boxes} onPress={() => router.push("/Activitylog")}>
                <Image source={require('@/assets/images/Activity-Log.png')} style={styles.icons}></Image>
                <Text style={styles.textbox}>Activity Log</Text>
            </Pressable>

        </View>

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#252525',
        paddingTop: 30
    },
    rowcontainer: {
        height: 50,
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center", 
        paddingLeft: 20
    },
    logo: {
        height: 130,
        resizeMode: 'contain',
        marginLeft: 40
    },
    menubtn:{
        width: '0%',
        alignItems: 'center'
    },
    menu: {
        height: 30,
        resizeMode: 'contain',
        justifyContent: 'center'
    },
    header: {
        height: 50,
        paddingLeft: 10,
        marginBottom: 10
    },
    h1: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold'
    },
    p: {
        color: 'white',
        fontSize: 14
    },
    boxes: {
        height: 180,
        width: 160,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
        gap: 10,
        padding: 20
    },
    textbox: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    icons: {
        height: 100,
        resizeMode: 'center'
    },
    menuimages: { 
        width: 30, 
        height: 30 }

});