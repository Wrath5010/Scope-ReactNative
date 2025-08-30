import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AddMedicine() {
  const router = useRouter();

  // State
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);

  const [selectedSort, setSelectedSort] = useState("Newest");
  const [sortVisible, setSortVisible] = useState(false);

  // Options
  const filters = ["All", "Tablets", "Capsules", "Syrup", "Injection"];
  const sorts = ["Newest", "Oldest", "A–Z", "Z–A", "Low Stock", "Expiring Soon"];

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
  };

  const handleSelectSort = (sort: string) => {
    setSelectedSort(sort);
    setSortVisible(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#252525" }}>
      <View style={styles.container}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Add medicine</Text>

        {/* Search Input */}
        <TextInput
          style={styles.search}
          placeholder="Product Name"
          placeholderTextColor="#888"
        />

        {/* Filter + Sort row */}
        <View style={styles.row}>
          {/* Filter Button */}
          <Pressable style={styles.optionButton} onPress={() => setFilterVisible(true)}>
            <Text style={styles.optionText}>{selectedFilter}</Text>
            <Ionicons name="chevron-down" size={18} color="white" />
          </Pressable>

          {/* Sort Button */}
          <Pressable style={styles.optionButton} onPress={() => setSortVisible(true)}>
            <Text style={styles.optionText}>{selectedSort}</Text>
            <Ionicons name="chevron-down" size={18} color="white" />
          </Pressable>
        </View>

        {/* Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterVisible}
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose a Category</Text>
              <FlatList
                data={filters}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.modalItem,
                      item === selectedFilter && styles.modalItemSelected,
                    ]}
                    onPress={() => handleSelectFilter(item)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        item === selectedFilter && styles.modalItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
              <Pressable onPress={() => setFilterVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Sort Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={sortVisible}
          onRequestClose={() => setSortVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <FlatList
                data={sorts}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.modalItem,
                      item === selectedSort && styles.modalItemSelected,
                    ]}
                    onPress={() => handleSelectSort(item)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        item === selectedSort && styles.modalItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
              <Pressable onPress={() => setSortVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: 320,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalItem: {
    padding: 12,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: "#00bcd4",
  },
  modalItemText: {
    fontSize: 16,
    color: "black",
  },
  modalItemTextSelected: {
    fontWeight: "bold",
    color: "white",
  },
  closeBtn: {
    marginTop: 15,
    alignSelf: "center",
  },
  closeBtnText: {
    color: "red",
    fontSize: 16,
  },
});
