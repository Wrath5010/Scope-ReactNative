import React, { useState } from "react";
import {View,Text,TextInput,Pressable,StyleSheet,Alert,ScrollView,} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CategorySelector from "@/components/ui/CategorySelector";
import DosageSelector from "@/components/ui/DosageSelector";
import DatePicker from "@/components/ui/DatePicker";
import NavigationBar from "@/components/ui/NavigationBar";
import Confirmation from "@/components/ui/Confirmation";

export default function AddMedicine() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [dosage, setDosage] = useState("Select Type");
  const [dosageVisible, setDosageVisible] = useState(false);
  const [manufacturer, setManu] = useState("");
  const [quantity, setQuantitydosage] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dosages = ["Tablet", "Capsule", "Syrup", "Injection", "Ointment"];

  const categories = ["Antibiotics", "Painkillers", "Cough & Cold", "Allergy", "Vitamins & Supplements", "Digestive Health", "Skin Care", "Cardiovascular", "Diabetes"];

  const dosageUnits: Record<string, string> = {
    Tablet: "pcs",
    Capsule: "pcs",
    Syrup: "ml",
    Injection: "ml",
    Ointment: "g",
  };

  const medicineData = {
  name,
  category,
  price,
  dosage,
  quantity,
  manufacturer,
  stockQuantity,
  expiryDate,
};

  // Handle Confirm button
  const handleAddMedicine = async () => {
    if (
      !name ||
      category === "Select Category" ||
      !price ||
      dosage === "Select Type" ||
      !quantity ||
      !manufacturer ||
      !expiryDate
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://192.168.68.102:5000/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          dosage,
          quantity: Number(quantity),
          manufacturer,
          stockQuantity,
          expiryDate,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Medicine added successfully!");
        router.push("/InventoryPage");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          "Failed to add medicine: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add medicine. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Add medicine</Text>

        <TextInput
          style={styles.input}
          placeholder="Medicine Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.rowcontainer}>
          <Pressable
            style={styles.categorybtn}
            onPress={() => setCategoryVisible(true)}
          >
            <Text style={styles.categoryText}>Category: {category}</Text>
          </Pressable>

          <TextInput
            style={styles.Priceinput}
            placeholder="$ Price"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={styles.rowcontainer}>
          <Pressable
            style={styles.categorybtn}
            onPress={() => setDosageVisible(true)}
          >
            <Text style={styles.categoryText}>Dosage type: {dosage}</Text>
          </Pressable>

          <TextInput
            key={dosage}
            style={styles.PackageInput}
            placeholder={dosageUnits[dosage] || "Quantity"}
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantitydosage}
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

        <TextInput
          style={styles.input}
          placeholder="Manufacturer Name"
          placeholderTextColor="#888"
          value={manufacturer}
          onChangeText={setManu}
        />

        <View style={[styles.rowcontainer, { marginTop: 15 }]}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              flex: 1,
              alignSelf: "center",
            }}
          >
            Stock Quantity:
          </Text>

          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.qButton}
              onPress={() =>
                setStockQuantity((prev) => (prev > 0 ? prev - 1 : prev))
              }
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

        <DatePicker
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
        />


        <View style={[styles.btnssection]}>
          <Pressable
            style={[styles.cancelbtn]}
            onPress={() => router.back()}
          >
            <Text style={{ color: "black", fontSize: 18, textAlign: "center", fontWeight: "500" }}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            style={[styles.confirmbtn]}
            onPress={() => {
              // validate required fields first
              if (
                !name ||
                category === "Select Category" ||
                !price ||
                dosage === "Select Type" ||
                !quantity ||
                !manufacturer ||
                !expiryDate
              ) {
                Alert.alert("Error", "Please fill in all required fields.");
                return;
              }

              // open confirmation modal instead of submitting
              setShowConfirmModal(true);
            }}
          >
            <Text style={{ color: "black", fontSize: 18, textAlign: "center", fontWeight: "500" }}>
              Confirm
            </Text>
          </Pressable>
        </View>

        <Confirmation
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleAddMedicine} // only call backend save when confirmed
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
  rowcontainer: {
    flexDirection: "row",
    width: "95%",
    paddingHorizontal: 22,
    marginTop: 15,
    gap: 10,
  },
  categorybtn: {
    flex: 2,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  Priceinput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  PackageInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  quantityContainer: {
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
  qButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  qValue: {
    color: "white",
    fontSize: 16,
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
    textAlign: "center",
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
});
