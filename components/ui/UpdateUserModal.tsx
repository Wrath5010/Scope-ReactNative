import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import CategorySelector from "@/components/ui/CategorySelector"; // reuse role selector

interface UpdateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    _id: string;
    fullName: string;
    email: string;
    role: "admin" | "pharmacist";
  };
}

export default function UpdateUserModal({
  visible,
  onClose,
  onSave,
  initialData,
}: UpdateUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "pharmacist">("pharmacist");
  const [roleVisible, setRoleVisible] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || "");
      setEmail(initialData.email || "");
      setRole(initialData.role || "pharmacist");
    }
  }, [initialData]);

  const roles: ("admin" | "pharmacist")[] = ["admin", "pharmacist"];

  const handleSave = () => {
    if (!fullName || !email || !role) {
      alert("Please fill in all fields.");
      return;
    }
    onSave({
      ...initialData,
      fullName,
      email,
      role,
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
          />

          <Pressable
            style={styles.selectorButton}
            onPress={() => setRoleVisible(true)}
          >
            <Text style={styles.selectorText}>
              Role: {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </Pressable>

          <CategorySelector
            visible={roleVisible}
            onClose={() => setRoleVisible(false)}
            selected={role}
            onSelect={(r) => {
              setRole(r as "admin" | "pharmacist");
              setRoleVisible(false);
            }}
            categories={roles}
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
  selectorButton: {
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  selectorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
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
