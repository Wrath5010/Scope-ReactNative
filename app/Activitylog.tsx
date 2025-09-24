import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import NavigationBar from "@/components/ui/NavigationBar";


export default function Activitylog() {
  const router = useRouter();
  const navigation = useNavigation();


  return (
    <SafeAreaView style={{backgroundColor: '#252525'}}>
    <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        
        <Text style={styles.title}>Activity Log</Text>
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
});