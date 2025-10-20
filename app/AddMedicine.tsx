import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CategorySelector from "@/components/ui/CategorySelector";
import DosageSelector from "@/components/ui/DosageSelector";
import DatePicker from "@/components/ui/DatePicker";
import NavigationBar from "@/components/ui/NavigationBar";
import Confirmation from "@/components/ui/Confirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from 'react-native-paper';
import { URL } from "./utils/api";

interface MedicineData {
  name: string;
  category: string;
  price: string;
  dosage: string;
  quantity: string;
  manufacturer: string;
  stockQuantity: number;
  expiryDate: Date | null;
}

export default function AddMedicine() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Select");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [dosage, setDosage] = useState("Select");
  const [dosageVisible, setDosageVisible] = useState(false);
  const [manufacturer, setManufacturer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  

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

  const medicineData: MedicineData = {
    name,
    category,
    price,
    dosage,
    quantity,
    manufacturer,
    stockQuantity,
    expiryDate,
  };

  const handleAddMedicine = async () => {
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

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "You must be logged in to add medicine.");
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      dosage,
      quantity: Number(quantity),
      manufacturer,
      stockQuantity: Number(stockQuantity),
      expiryDate: expiryDate.toISOString(),
    };

    console.log("Payload:", payload); // Debug

    const response = await fetch(`${URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || text || "Failed to add medicine");
    }

    Alert.alert("Success", "Medicine added successfully!");
    router.push("/InventoryPage");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      Alert.alert("Error", "Failed to add medicine: " + err.message);
    } else {
      Alert.alert("Error", "An unknown error occurred");
    }
  }
};


  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Add Medicine</Text>

        <TextInput
          style={styles.input}
          placeholder="Medicine Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          mode="outlined"
          outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
          theme={{ colors: { text: "black", placeholder: "#888" } }} 
          left={<TextInput.Affix text="Product: " />}
        />

        <TextInput
          style={styles.input}
          placeholder="Manufacturer"
          placeholderTextColor="#888"
          value={manufacturer}
          onChangeText={setManufacturer}
          mode="outlined"
          outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
          theme={{ colors: { text: "black", placeholder: "#888" } }} 
          left={<TextInput.Affix text="Manufacturer: " />}
        />

        <View style={styles.rowContainer}>
          <Pressable style={styles.selectorButton} onPress={() => setDosageVisible(true)}>
            <Text style={styles.selectorText}>Formula: {dosage}</Text>
          </Pressable>

          <Pressable style={styles.selectorButton} onPress={() => setCategoryVisible(true)}>
            <Text style={styles.selectorText}>Category: {category}</Text>
          </Pressable>
        </View>

        <View style={styles.rowContainer}>

          <TextInput
            style={styles.quantityInput}
            placeholder="Qty."
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            right={<TextInput.Affix text={dosageUnits[dosage] || ""} />}
            outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
            theme={{ colors: { text: "black", placeholder: "#888" } }} 
          />

          <TextInput
            style={styles.priceInput}
            placeholder="Price"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            left={<TextInput.Affix text="$ " />}
            mode="outlined"
            outlineStyle={{ borderRadius: 12, borderColor: "#252525", borderWidth: 2 }} 
            theme={{ colors: { text: "black", placeholder: "#888" } }} 
          />
        </View>

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

        <View style={[styles.rowContainer, { marginTop: 15 }]}>
          <Text style={styles.stockText}>Stock Quantity:</Text>
          <View style={styles.stockContainer}>
            <Pressable style={styles.qButton} onPress={() => setStockQuantity(prev => Math.max(prev - 1, 0))}>
              <Text style={styles.qButtonText}>-</Text>
            </Pressable>
            <Text style={styles.qValue}>{stockQuantity}</Text>
            <Pressable style={styles.qButton} onPress={() => setStockQuantity(prev => prev + 1)}>
              <Text style={styles.qButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <DatePicker expiryDate={expiryDate} setExpiryDate={setExpiryDate} />

        <View style={styles.buttonSection}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>

          <Pressable style={styles.confirmButton} onPress={() => setShowConfirmModal(true)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>
        </View>

        <Confirmation
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleAddMedicine}
          medicineData={medicineData}
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
    paddingBottom: 80 
  },
  backBtn: { 
    position: "absolute", 
    top: 28, 
    left: 20, 
    padding: 8, 
    zIndex: 10 
  },
  title: { 
    alignSelf: "center", 
    marginTop: 35, 
    fontSize: 26, 
    color: "white", 
    fontWeight: "bold" 
  },
  input: { 
    height: 50, 
    width: "85%", 
    backgroundColor: "white", 
    borderRadius: 12, 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  rowContainer: { 
    flexDirection: "row", 
    width: "95%", 
    paddingHorizontal: 22, 
    marginTop: 15, 
    gap: 10 
  },
  selectorButton: { 
    flex: 2, 
    height: 50, 
    backgroundColor: "#3A3A3A", 
    borderRadius: 12, 
    justifyContent: "center", 
    paddingHorizontal: 12 
  },
  selectorText: { 
    color: "white", 
    fontSize: 16, 
    textAlign: "center", 
    flexWrap: 'wrap', 
  },
  priceInput: { 
    flex: 1, 
    height: 50, 
    backgroundColor: "white", 
    borderRadius: 12, 
    paddingHorizontal: 10 
  },
  quantityInput: { 
    flex: 1, 
    height: 50, 
    backgroundColor: "white", 
    borderRadius: 12, 
    paddingHorizontal: 10 
  },
  stockText: { 
    color: "white", 
    fontSize: 16, 
    flex: 1, 
    alignSelf: "center" 
  },
  stockContainer: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    backgroundColor: "#3A3A3A", 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    height: 50 
  },
  qButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    backgroundColor: "#252525", 
    borderRadius: 8 
  },
  qButtonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  qValue: { 
    color: "white", 
    fontSize: 16 
  },
  buttonSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginHorizontal: 20, 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    gap: 10, 
    marginTop: 20 
  },
  cancelButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 15, 
    backgroundColor: "#DC3939", 
    borderRadius: 12, 
    flex: 1 
  },
  confirmButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 15, 
    backgroundColor: "#4CAF50", 
    borderRadius: 12, flex: 1, 
    textAlign: "center" 
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    textAlign: "center", 
    fontWeight: "500" 
  },
});
