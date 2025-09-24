import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import NavigationBar from "@/components/ui/NavigationBar";
import Confirmation from "@/components/ui/Confirmation";
import CategorySelector from "@/components/ui/CategorySelector";

export default function RegisterUser() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"pharmacist" | "admin">("pharmacist"); // default
  const [roleVisible, setRoleVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const roles: ("pharmacist" | "admin")[] = ["pharmacist", "admin"];

  const userData = { fullName, email, password, role };

  const handleRegister = async () => {
  if (!fullName || !email || !password || !role) {
    Alert.alert("Error", "Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("http://192.168.68.102:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // Check if response is OK first
    if (response.ok) {
      const data = await response.json();
      Alert.alert("Success", `User registered successfully! Role: ${data.user.role}`);
      router.push("/Dashboard");
    } else {
      // Try to parse error JSON, fallback to text if parsing fails
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
    Alert.alert("Error", "Failed to register user. Please check your network and try again.");
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
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Role selector */}
        <Pressable
          style={styles.categorybtn}
          onPress={() => setRoleVisible(true)}
        >
          <Text style={styles.categoryText}>
            Role: {role.charAt(0).toUpperCase() + role.slice(1)}
          </Text>
        </Pressable>

        <CategorySelector
          visible={roleVisible}
          onClose={() => setRoleVisible(false)}
          selected={role}
          onSelect={(r) => {
            setRole(r as "pharmacist" | "admin");
            setRoleVisible(false);
          }}
          categories={roles}
        />

        {/* Buttons */}
        <View style={styles.btnssection}>
          <Pressable style={styles.cancelbtn} onPress={() => router.back()}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={styles.confirmbtn}
            onPress={() => {
              if (!fullName || !email || !password || !role) {
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
  categorybtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 20,
    marginHorizontal: 40,
    width: "50%",
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
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
