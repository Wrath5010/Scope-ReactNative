import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";

type CategorySelectorProps = {
  visible: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (cat: string) => void;
  categories: string[];
};

export default function CategorySelector({ visible, onClose, selected, onSelect, categories }: CategorySelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => {{
            onClose()
        }}} />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Category</Text>
          <ScrollView contentContainerStyle={styles.chipContainer} showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.chip, selected === cat && styles.chipSelected]}
                onPress={() => onSelect(cat)}
              >
                <Text style={[styles.chipText, selected === cat && styles.chipTextSelected]}>{cat}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <Text style={{color: 'white', marginTop: 20}}>Tap outside to exit</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.6)", 
    justifyContent: "center", 
    alignItems: "center" 
},
  modalContainer: { 
    width: 320, 
    backgroundColor: "white", 
    borderRadius: 12, 
    padding: 20, 
    maxHeight: "70%" 
},
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center" 
},
  chipContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 10 
},
  chip: { 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 20, 
    backgroundColor: "#ddd", 
    marginBottom: 10 
},
  chipSelected: { 
    backgroundColor: "#252525" 
},
  chipText: { 
    fontSize: 14, 
    color: "#333" 
},
  chipTextSelected: { 
    color: "white", 
    fontWeight: "bold" 
},
});
