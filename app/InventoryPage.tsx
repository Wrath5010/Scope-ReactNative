import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "@/components/ui/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import DeleteModal from "@/components/ui/DeleteModal";

const categories = [
  "All", "Antibiotics", "Painkillers", "Cough & Cold", "Allergy", 
  "Vitamins & Supplements", "Digestive Health", "Skin Care", "Cardiovascular", "Diabetes",
];

const sortOptions = ["None", "A-Z", "Z-A", "High Stock", "Low Stock", "Expiring Soon", "Expiring Later"];

interface Medicine {
  _id: string;
  name: string;
  category: string;
  price: number;
  dosage: string;
  quantity: number;
  stockQuantity: number;
  manufacturer: string;
  expiryDate: string;
}

export default function Inventory() {
  const router = useRouter();

  // === STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("None");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Medicine | null>(null);

  const { deleteMode } = useLocalSearchParams<{ deleteMode?: string }>();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // === FETCH MEDICINES ===
  const fetchMedicines = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch("http://192.168.68.114:5000/api/medicines", { headers });
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse response as JSON: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setMedicines(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch medicines error:", err.message);
        Alert.alert("Error", "Failed to fetch medicines: " + err.message);
      } else {
        Alert.alert("Error", "An unknown error occurred while fetching medicines.");
      }
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  useEffect(() => { if (deleteMode === "true") setIsDeleteMode(true); }, [deleteMode]);

  // === CANCEL DELETE MODE ===
  const cancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedItems([]);
    router.replace("/InventoryPage"); // go back without query
  };

  // === DELETE HANDLERS ===
  const handleDeletePress = (item: Medicine) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `http://192.168.68.114:5000/api/medicines/${itemToDelete._id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete medicine");
      }

      setMedicines(prev => prev.filter(m => m._id !== itemToDelete._id));
      setItemToDelete(null);
      setDeleteModalVisible(false);
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    }
  };

  // === FILTER, SEARCH, SORT ===
  const displayedData = useMemo(() => {
    let result = [...medicines];

    if (selectedFilter !== "All") result = result.filter(item => item.category === selectedFilter);
    if (searchQuery.trim() !== "") result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (selectedSort) {
      case "A-Z": result.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "Z-A": result.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "High Stock": result.sort((a,b) => (b.quantity ?? 0) - (a.quantity ?? 0)); break;
      case "Low Stock": result.sort((a,b) => (a.quantity ?? 0) - (b.quantity ?? 0)); break;
      case "Expiring Soon": result.sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()); break;
      case "Expiring Later": result.sort((a,b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()); break;
    }

    return result;
  }, [medicines, searchQuery, selectedFilter, selectedSort]);

  return (
    <SafeAreaView style={{ backgroundColor: "#252525", flex: 1 }}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Inventory</Text>

        <View style={styles.SecondCont}>
          <TextInput
            style={styles.search}
            placeholder="Product Name"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.RowContainer}>
            <Pressable style={styles.filter} onPress={() => setFilterVisible(true)}>
              <Text style={styles.btnText}>Filter: {selectedFilter}</Text>
            </Pressable>

            <Pressable style={styles.sort} onPress={() => setSortVisible(true)}>
              <Text style={styles.btnText}>Sort: {selectedSort}</Text>
            </Pressable>
          </View>
        </View>

        {/* FILTER MODAL */}
        <Modal visible={filterVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setFilterVisible(false)} />
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Filter by Category</Text>
              <View style={styles.chipContainer}>
                {categories.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, selectedFilter === option && styles.chipSelected]}
                    onPress={() => { setSelectedFilter(option); setFilterVisible(false); }}
                  >
                    <Text style={[styles.chipText, selectedFilter === option && styles.chipTextSelected]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={{ color: "white", marginTop: 20 }}>Tap outside to exit</Text>
          </View>
        </Modal>

        {/* SORT MODAL */}
        <Modal visible={sortVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setSortVisible(false)} />
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <View style={styles.chipContainer}>
                {sortOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, selectedSort === option && styles.chipSelected]}
                    onPress={() => { setSelectedSort(option); setSortVisible(false); }}
                  >
                    <Text style={[styles.chipText, selectedSort === option && styles.chipTextSelected]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={{ color: "white", marginTop: 20 }}>Tap outside to exit</Text>
          </View>
        </Modal>

        {/* MEDICINE LIST */}
        <FlatList
          data={displayedData}
          keyExtractor={(item) => item._id}
          style={{ marginTop: 55 }}
          contentContainerStyle={{ paddingBottom: 300 }}
          renderItem={({ item }: { item: Medicine }) => {
            const today = new Date();
            const expiry = new Date(item.expiryDate);
            const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000*60*60*24));
            let expiryText = item.expiryDate;
            let expiryColor = "#555";
            if (daysToExpiry <= 30) { expiryColor = "#dc3939"; expiryText += " (Near Expiry)"; }
            else if (daysToExpiry <= 90) { expiryColor = "#e6a23c"; expiryText += " (Expiring Soon)"; }

            return (
              <View style={lists.listItem}>
                <View style={lists.leftSection}>
                  <Text style={lists.itemName}>{item.name}</Text>
                  <Text style={lists.itemText}>Category: {item.category}</Text>
                  <Text style={lists.itemText}>Dosage: {item.dosage ?? "-"}</Text>
                  <Text style={lists.itemText}>Manufacturer: {item.manufacturer ?? "-"}</Text>
                </View>

                <View style={lists.rightSection}>
                  <Text style={lists.itemText}>Qty: {item.quantity}</Text>
                  <Text style={lists.itemText}>Stock: {item.stockQuantity ?? 0}</Text>
                  <Text style={lists.itemText}>Price: ${item.price}</Text>
                  <Text style={[lists.itemText, { color: expiryColor }]}>{expiryText}</Text>

                  {/* Update & Delete buttons */}
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                    <Pressable
                      onPress={() => Alert.alert("Update pressed")}
                      style={{ backgroundColor: "#3A3A3A", padding: 6, borderRadius: 6 }}
                    >
                      <Text style={{ color: "white" }}>Update</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleDeletePress(item)}
                      style={{ backgroundColor: "#dc3939", padding: 6, borderRadius: 6 }}
                    >
                      <Text style={{ color: "white" }}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* DELETE MODAL */}
        <DeleteModal
          visible={deleteModalVisible}
          itemName={itemToDelete?.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
        />

      </View>

      <NavigationBar />
    </SafeAreaView>
  );
}


// === Styles (unchanged) ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#252525", alignItems: "center" },
  backBtn: { position: "absolute", top: 28, left: 20, padding: 8, zIndex: 10 },
  title: { alignSelf: "center", marginTop: 35, fontSize: 26, color: "white", fontWeight: "bold" },
  search: { height: 50, width: "100%", backgroundColor: "white", borderRadius: 12, paddingHorizontal: 12, marginTop: 15 },
  SecondCont: { justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20, width: "85%" },
  RowContainer: { flexDirection: "row", justifyContent: "space-between", gap: 8, flex: 1 },
  filter: { flex: 1, height: 50, backgroundColor: "#3A3A3A", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  sort: { flex: 1, height: 50, backgroundColor: "#3A3A3A", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  btnText: { color: "white", fontSize: 16, fontWeight: "500", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.79)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 320, backgroundColor: "white", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#f0f0f0", borderRadius: 20 },
  chipSelected: { backgroundColor: "#252525" },
  chipText: { fontSize: 16, color: "#333" },
  chipTextSelected: { color: "white", fontWeight: "bold" },
});

const lists = StyleSheet.create({
  listItem: { backgroundColor: "white", padding: 20, borderRadius: 12, marginVertical: 5, width: "92%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  leftSection: { flex: 2, justifyContent: "space-between", gap: 10 },
  rightSection: { flex: 1, justifyContent: "space-between", alignItems: "flex-end", gap: 10 },
  itemName: { fontSize: 16, fontWeight: "500" },
  itemText: { fontSize: 14, color: "#555" },
});

const deleteStyles = StyleSheet.create({
  actionBar: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#252525",
    borderTopWidth: 1,
    borderColor: "#444",
  },
  btn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "600" },
});
