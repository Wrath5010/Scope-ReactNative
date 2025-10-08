import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";


export default function Startpage() {
  const  router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.page}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo}></Image>
      </View>
      <View style={styles.contsecond}>
        <Text style={styles.Maintext}>Manage, Track, and Protect Your Inventory.</Text>
        <Text style={styles.Secondtext}>Authorized Access Only - Your Data, Secured.</Text>

        <View style={styles.buttoncont}>
            <Pressable style={styles.button} onPress={() => router.push("/LoginPage")}>
            <Text style={styles.buttonText}>Login</Text>
            </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  container: {
    height: 480, // fixed height black area
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  MainTag: {
    color: 'white',
    fontSize: 20,
  },
  contsecond: {
    flex: 1, // fills the rest of the height
    backgroundColor: 'white',
    padding: 20
  },
  logo: {
    height: 280,
    marginLeft: 15,
    resizeMode: 'contain'
  },
  Maintext: {
    fontSize: 26,
    marginTop: 20,
    fontWeight: 'bold'
  },
  Secondtext: {
    marginTop: 5,
    fontSize: 16,
    width: 250
  },
  button:{
    backgroundColor: "#252525",
    justifyContent: 'center',
    height: 60,
    width: "80%",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText:{
    color: "white", fontSize: 16, fontWeight: "bold" 
  },
  buttoncont:{
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
