import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const categories = [
  "All",
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

const sortOptions = ["None", "A-Z", "Z-A", "Newest", "Oldest"];

const inventoryData = [
  { id: '1', name: 'Paracetamol', quantity: 20 },
  { id: '2', name: 'Ibuprofen', quantity: 15 },
  { id: '3', name: 'Vitamin C', quantity: 10 },
  { id: '4', name: 'Amoxicillin', quantity: 5 },
  { id: '5', name: 'Amoxicillin', quantity: 5 },
  { id: '6', name: 'Amoxicillin', quantity: 5 },
  { id: '7', name: 'Amoxicillin', quantity: 5 },
  { id: '8', name: 'Amoxicillin', quantity: 5 },
  { id: '9', name: 'Amoxicillin', quantity: 5 },
  { id: '10', name: 'Amoxicillin', quantity: 5 },
];

export default function Inventory() {
  const router = useRouter();
  const navigation = useNavigation();

  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("None");

  const data = ["Apples", "Bananas", "Cherries", "Oranges", "Grapes"];

  return (
    <SafeAreaView style={{ backgroundColor: "#252525" }}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Inventory</Text>

        <View style={styles.SecondCont}>
          <TextInput style={styles.search} placeholder="Product Name" placeholderTextColor="#888" />

          <View style={styles.RowContainer}>
            {/* Filter Button */}
            <Pressable style={styles.filter} onPress={() => setFilterVisible(true)}>
              <Text style={styles.btnText}>Filter: {selectedFilter}</Text>
            </Pressable>

            {/* Sort Button */}
            <Pressable style={styles.sort} onPress={() => setSortVisible(true)}>
              <Text style={styles.btnText}>Sort: {selectedSort}</Text>
            </Pressable>
          </View>
        </View>


        <Modal visible={filterVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            
            <Pressable
              style={StyleSheet.absoluteFill} 
              onPress={() => setFilterVisible(false)}
            />

            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Filter by Category</Text>
              <View style={styles.chipContainer}>
                {categories.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, selectedFilter === option && styles.chipSelected]}
                    onPress={() => {
                      setSelectedFilter(option);
                      setFilterVisible(false);
                    }}
                  >
                    <Text style={[styles.chipText, selectedFilter === option && styles.chipTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={{color: 'white', marginTop: 20}}>Tap outside to exit</Text>
          </View>
        </Modal>


        <Modal visible={sortVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            {/* Outer Pressable to close modal when tapping outside */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setSortVisible(false)}
            />

            {/* White box with chips */}
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <View style={styles.chipContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, selectedSort === option && styles.chipSelected]}
                    onPress={() => {
                      setSelectedSort(option);
                      setSortVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.chipText, selectedSort === option && styles.chipTextSelected]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={{color: 'white', marginTop: 20}}>Tap outside to exit</Text>
          </View>
        </Modal>

        <FlatList
          data={inventoryData}
          keyExtractor={(item) => item.id}
          style={{marginTop: 60}}
          contentContainerStyle={{ paddingBottom: 100 }} // extra space at bottom
          renderItem={({ item }) => (
            <View style={lists.listItem}>
              <Text style={lists.itemName}>{item.name}</Text>
              <Text style={lists.itemQty}>Qty: {item.quantity}</Text>
              <Text>Hello</Text>
            </View>
          )}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#252525",
    alignItems: "center",
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
  search: {
    height: 50,
    width: 320,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  SecondCont: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    width: 320,
  },
  RowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    flex: 1,
  },
  filter: {
    flex: 1,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sort: {
    flex: 1,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 320,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: "#252525",
  },
  chipText: {
    fontSize: 16,
    color: "#333",
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
});


const lists = StyleSheet.create({
    listItem: {
  backgroundColor: 'white',
  padding: 15,
  borderRadius: 12,
  marginVertical: 4,
  width: '92%',
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, 
},
itemName: {
  fontSize: 16,
  fontWeight: '500',
},
itemQty: {
  fontSize: 16,
  fontWeight: '500',
  color: '#555',
},

})