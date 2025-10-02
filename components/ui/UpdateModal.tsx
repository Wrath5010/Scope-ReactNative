import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DatePicker from "./DatePicker";
import CategorySelector from "./CategorySelector";
import DosageSelector from "./DosageSelector";
import { TextInput } from 'react-native-paper';

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any; // Medicine object passed for editing
}

export default function UpdateModal({
  visible,
  onClose,
  onSave,
  initialData,
}: UpdateModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Select");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [dosage, setDosage] = useState("Select");
  const [dosageVisible, setDosageVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const dosages = ["Tablet", "Capsule", "Syrup", "Injection", "Ointment"];
  const categories = [
    "Antibiotics",
    "Painkillers",
    "Cough & Cold",
    "Allergy",
    "Vitamins & Supplements",
    "Digestive Health",
    "Skin Care",
    "Cardiovascular",
    "Diabetes",
  ];

  const dosageUnits: Record<string, string> = {
    Tablet: "pcs",
    Capsule: "pcs",
    Syrup: "ml",
    Injection: "ml",
    Ointment: "g",
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "Select");
      setPrice(String(initialData.price ?? ""));
      setDosage(initialData.dosage || "Select");
      setQuantity(String(initialData.quantity ?? ""));
      setManufacturer(initialData.manufacturer || "");
      setStockQuantity(initialData.stockQuantity ?? 0);

      if (initialData.expiryDate) {
        const parsedDate = new Date(initialData.expiryDate);
        setExpiryDate(!isNaN(parsedDate.getTime()) ? parsedDate : null);
      } else {
        setExpiryDate(null);
      }
    }
  }, [initialData]);

  const handleSave = () => {
    if (
      !name ||
      category === "Select" ||
      !price ||
      dosage === "Select" ||
      !quantity ||
      !manufacturer ||
      !expiryDate
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    onSave({
      ...initialData,
      name,
      category,
      price: parseFloat(price),
      dosage,
      quantity: parseInt(quantity),
      manufacturer,
      stockQuantity,
      expiryDate: expiryDate ? expiryDate.toISOString() : "",
    });

    Alert.alert("Success", "Medicine Updated successfully!");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.title}>Update Medicine</Text>

            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
              theme={{ colors: { text: "black", placeholder: "#888" } }} 
              left={<TextInput.Affix text="Name: " />}
            />

            <TextInput
              style={styles.input}
              placeholder="Manufacturer"
              value={manufacturer}
              onChangeText={setManufacturer}
              mode="outlined"
              outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
              theme={{ colors: { text: "black", placeholder: "#888" },}} 
              left={<TextInput.Affix text="Manufacturer: " />}
            />

            <View style={styles.rowContainer}>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setDosageVisible(true)}
              >
                <Text style={styles.selectorText}>Formula: {dosage}</Text>
              </Pressable>

              <Pressable
                style={styles.selectorButton}
                onPress={() => setCategoryVisible(true)}
              >
                <Text style={styles.selectorText}>Category: {category}</Text>
              </Pressable>
            </View>

            <View style={styles.rowContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="$ Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                mode="outlined"
                outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
                theme={{ colors: { text: "black", placeholder: "#888" },}} 
                left={<TextInput.Affix text="$" />}
              />

              <TextInput
                style={styles.quantityInput}
                placeholder={dosageUnits[dosage] || "Quantity"}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                mode="outlined"
                outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
                theme={{ colors: { text: "black", placeholder: "#888" },}} 
                left={<TextInput.Affix text={dosageUnits[dosage] || ""} />}
              />
            </View>

            <View style={[styles.rowContainer, { marginTop: 15 }]}>
              <Text style={styles.stockText}>Stock Quantity:</Text>
              <View style={styles.stockContainer}>
                <Pressable
                  style={styles.qButton}
                  onPress={() => setStockQuantity((prev) => Math.max(prev - 1, 0))}
                >
                  <Text style={styles.qButtonText}>-</Text>
                </Pressable>
                <Text style={styles.qValue}>{stockQuantity}</Text>
                <Pressable
                  style={styles.qButton}
                  onPress={() => setStockQuantity((prev) => prev + 1)}
                >
                  <Text style={styles.qButtonText}>+</Text>
                </Pressable>
              </View>
            </View>

            <DatePicker expiryDate={expiryDate} setExpiryDate={setExpiryDate} />

            <View style={styles.buttonRow}>
              <Pressable
                onPress={onClose}
                style={[styles.btn, { backgroundColor: "#dc3939ff" }]}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.btn, { backgroundColor: "#367154ff" }]}
              >
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* Category Selector */}
        <CategorySelector
          visible={categoryVisible}
          onClose={() => setCategoryVisible(false)}
          selected={category}
          onSelect={(cat) => {
            setCategory(cat);
            setCategoryVisible(false);
          }}
          categories={categories}
        />

        {/* Dosage Selector */}
        <DosageSelector
          visible={dosageVisible}
          onClose={() => setDosageVisible(false)}
          selected={dosage}
          onSelect={(d) => {
            setDosage(d);
            setDosageVisible(false);
          }}
          dosages={dosages}
        />
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
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  input: {
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    gap: 10,
  },
  selectorButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  selectorText: { 
    color: "white", 
    fontSize: 16, 
    textAlign: "center" },
  priceInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  quantityInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  stockText: { color: "white", fontSize: 16, flex: 1, alignSelf: "center" },
  stockContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
  },
  qButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#252525",
    borderRadius: 8,
  },
  qButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  qValue: { color: "white", fontSize: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
  },
  btnText: { 
    color: "black", 
    fontSize: 18, 
    textAlign: "center", 
    fontWeight: "500" 
  },
});
