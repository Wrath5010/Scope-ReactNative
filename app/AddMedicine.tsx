import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoginScreen from "./LoginPage";

export default function Addmedicine(){
    const router = useRouter();

    return(
        <View style={styles.container}>
            <View>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </Pressable>

                <Text style={styles.title}>Enter New Medicine</Text>
                <View style={styles.SecondCont}>
                    <TextInput style={styles.inputlong} placeholder="Product Name"></TextInput>

                    <View style= {styles.RowContainer}>
                        <TextInput style={styles.medinput} placeholder="Types of Medicine"></TextInput>
                        <TextInput style={styles.priceinput} placeholder="Price"></TextInput>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#252525',
        padding: 30,
        justifyContent: 'flex-start'
    },
    backBtn: {
        position: "absolute",
        top: 40,
        left: 0,
        zIndex: 10,
    },
    SecondCont:{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30
    },
    title: {
        fontSize: 26,
        color: 'white',
        marginTop: 100,
        marginBottom: 20,
    },
    inputlong: {
        height: 60,
        width: 320,
        backgroundColor: 'white',
        borderRadius: 12
    },
    RowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    medinput: {
        flex: 1,
        height: 60,
        width: 50,
        backgroundColor: 'white',
        borderRadius: 12
    },
    priceinput: {
        height: 60,
        width: 100,
        backgroundColor: 'white',
        borderRadius: 12
    }
})