import React, { useState } from "react";
import { View, Text,  TextInput, Pressable, StyleSheet, Alert, Image,  SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./utils/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);

      await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));

      // Navigate to dashboard
      router.replace("/Dashboard");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#252525" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              paddingBottom: 60,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={() => router.push("/StartUp")} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </Pressable>

            <Image
              style={styles.logo}
              source={require("@/assets/images/logo.png")}
            />

            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
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

            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { 
    position: "absolute", 
    top: 50, 
    left: 20, 
    padding: 8, 
    zIndex: 10 
  },
  logo: { 
    height: 200, 
    resizeMode: "contain", 
    marginBottom: 10, 
    marginLeft: 15 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 30 
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: { 
    backgroundColor: "grey", 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    marginTop: 10 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});
