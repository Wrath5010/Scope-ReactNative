import React from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";

interface DeleteModalProps {
  visible: boolean;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  itemName,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Confirm Delete</Text>
          <Text style={{ marginVertical: 10 }}>
            Are you sure you want to delete "{itemName}"?
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable style={[styles.btn, { backgroundColor: "#dc3939" }]} onPress={onConfirm}>
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>

            <Pressable style={[styles.btn, { backgroundColor: "#555" }]} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600" },
});
