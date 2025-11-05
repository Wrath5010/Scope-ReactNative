import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from "react-native";

interface UserData {
  fullName: string;
  email: string;
  password?: string;
  role: "admin" | "pharmacist";
}

interface MedicineData {
  name: string;
  category: string;
  price: string | number;
  dosage: string;
  quantity: string | number;
  manufacturer: string;
  stockQuantity: number;
  expiryDate: Date | null;
}

interface ConfirmationProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medicineData?: MedicineData;
  userData?: UserData;
}

export default function Confirmation({
  visible,
  onClose,
  onConfirm,
  medicineData,
  userData,
}: ConfirmationProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {medicineData ? "Confirm Medicine Details" : "Confirm User Details"}
          </Text>

          <ScrollView style={{ maxHeight: 300 }}>
            {medicineData && (
              <>
                <Text style={styles.modalText}>Name: {medicineData.name}</Text>
                <Text style={styles.modalText}>Category: {medicineData.category}</Text>
                <Text style={styles.modalText}>Price: ${medicineData.price}</Text>
                <Text style={styles.modalText}>Dosage: {medicineData.dosage}</Text>
                <Text style={styles.modalText}>Quantity: {medicineData.quantity}</Text>
                <Text style={styles.modalText}>Manufacturer: {medicineData.manufacturer}</Text>
                <Text style={styles.modalText}>Stock Quantity: {medicineData.stockQuantity}</Text>
                <Text style={styles.modalText}>
                  Expiry Date: {medicineData.expiryDate?.toLocaleDateString()}
                </Text>
              </>
            )}

            {userData && (
              <>
                <Text style={styles.modalText}>Full Name: {userData.fullName}</Text>
                <Text style={styles.modalText}>Email: {userData.email}</Text>
                <Text style={styles.modalText}>Role: {userData.role}</Text>
                {userData.password && (
                  <Text style={styles.modalText}>Password: {userData.password}</Text>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.modalBtns}>
            <Pressable style={styles.cancelbtn} onPress={onClose}>
              <Text style={{ color: "white", textAlign: "center", fontWeight: "500" }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable style={styles.confirmbtn} onPress={onConfirm}>
              <Text style={{ color: "white", textAlign: "center", fontWeight: "500" }}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelbtn: {
    backgroundColor: '#dc3939',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  confirmbtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
});
