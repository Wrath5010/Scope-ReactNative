import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';


export default function AddMedicine() {
  const router = useRouter();
  const navigation = useNavigation();

  const data = ['Apples', 'Bananas', 'Cherries', 'Oranges', 'Grapes'];

  return (
    <SafeAreaView style={{backgroundColor: '#252525'}}>
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <Text style={styles.title}>Add medicine</Text>

      <View style={styles.SecondCont}>
        <TextInput style={styles.search} placeholder="Product Name"></TextInput>
      
        <View style= {styles.RowContainer}>
          {/* make them modal tags instead of input*/}
          <TextInput style={styles.filter} placeholder="filter"></TextInput>
          <TextInput style={styles.sort} placeholder="Sort"></TextInput>
        </View>
      </View>

      <Text>hello</Text>
      

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
    search: {
      height: 50,
      width: 320,
      backgroundColor: 'white',
      borderRadius: 12
    },
    SecondCont:{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        width: 320
    },
    RowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        flex: 1
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
    },
    item: { 
      padding: 15, 
      borderBottomWidth: 1, 
      borderBottomColor: '#ccc' 
    },
    text: { 
      fontSize: 18 
    },

});