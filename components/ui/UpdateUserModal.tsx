import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

interface UpdateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { _id: string; fullName: string; email: string; password?: string }) => void;
  initialData: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function UpdateUserModal({
  visible,
  onClose,
  onSave,
  initialData,
}: UpdateUserModalProps) {
  const [fullName, setFullName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState("");

  // Update state if initialData changes
  useEffect(() => {
    if (initialData) {
      setFullName(initialData.name || "");
      setEmail(initialData.email || "");
      setPassword("");
    }
  }, [initialData]);

  const handleSave = () => {
    if (!fullName || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({
      _id: initialData._id,
      fullName,
      email,
      password: password || undefined,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Update User</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="New Password (optional)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={[styles.btn, { backgroundColor: "#555" }]}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.btn, { backgroundColor: "#3A8" }]}
            >
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "white" },
  input: {
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
});
