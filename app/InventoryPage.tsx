import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';


export default function Inventory() {
  const router = useRouter();
  const navigation = useNavigation();


  return (
    <SafeAreaView style={{backgroundColor: '#252525'}}>
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <Text style={styles.title}>Inventory</Text>

      <View style={styles.SecondCont}>
        <TextInput style={styles.search} placeholder="Product Name"></TextInput>
      
        <View style= {styles.RowContainer}>
          {/* make them modal tags instead of input*/}
          <TextInput style={styles.filter} placeholder="filter"></TextInput>
          <TextInput style={styles.sort} placeholder="Sort"></TextInput>
        </View>
      </View>

    </View>
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
    top: 30,
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
    search: {
      height: 50,
      width: 320,
      backgroundColor: 'white',
      borderRadius: 12
    },
    SecondCont:{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30
    },
    RowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        width: 300
    },
    filter: {
        flex: 1,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12
    },
    sort: {
        flex: 1,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12
    }
    

});