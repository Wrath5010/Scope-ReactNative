import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import NavigationBar from "@/components/ui/NavigationBar";
import Confirmation from "@/components/ui/Confirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./utils/api";

// Define the UserData type (making it simple, only pharmacists added and one admin)
type UserData = {
  fullName: string;
  email: string;
  password: string;
  role: "pharmacist"; 
};

export default function RegisterUser() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // All users added through this form will be pharmacists
  const userData: UserData = { 
    fullName, 
    email, 
    password, 
    role: "pharmacist" 
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          "Success",
          `User registered successfully! Role: ${data.user.role}`
        );
        router.push("/Dashboard");
      } else {
        let errorMessage = "Unknown error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        Alert.alert("Error", `Failed to register: ${errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Failed to register user. Please check your network and try again."
      );
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Register User</Text>

        <TextInput
          style={[styles.input, { marginTop: 100 }]}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        {/* Buttons */}
        <View style={styles.btnssection}>
          <Pressable style={styles.cancelbtn} onPress={() => router.back()}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={styles.confirmbtn}
            onPress={() => {
              if (!fullName || !email || !password) {
                Alert.alert("Error", "Please fill in all fields.");
                return;
              }
              setShowConfirmModal(true);
            }}
          >
            <Text style={styles.btnText}>Confirm</Text>
          </Pressable>
        </View>

        {/* Confirmation Modal */}
        <Confirmation
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleRegister}
          userData={userData}
        />
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252525",
    alignItems: "center",
    gap: 15,
    paddingBottom: 80,
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    alignSelf: "center",
    marginTop: 35,
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cancelbtn: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: "#dc3939ff",
    borderRadius: 16,
    flex: 1,
  },
  confirmbtn: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: "#367154ff",
    borderRadius: 16,
    flex: 1,
  },
  btnssection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 10,
    gap: 30,
    marginTop: 20,
  },
  btnText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
});
