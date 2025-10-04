import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";

interface SortModalProps {
  visible: boolean;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

export default function SortModal({ visible, options, selectedOption, onSelect, onClose }: SortModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Sort by</Text>
          <View style={styles.chipContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, selectedOption === option && styles.chipSelected]}
                onPress={() => { onSelect(option); onClose(); }}
              >
                <Text style={[styles.chipText, selectedOption === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={{ color: "white", marginTop: 20 }}>Tap outside to exit</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.79)", 
    justifyContent: "center", 
    alignItems: "center" 
},
  modalBox: { 
    width: 320, 
    backgroundColor: "white", 
    borderRadius: 12, 
    padding: 20 
},
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15 
},
  chipContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 10 
},
  chip: { 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 20 
},
  chipSelected: { 
    backgroundColor: "#252525" 
},
  chipText: { 
    fontSize: 16, 
    color: "#333" 

  },
  chipTextSelected: { 
    color: "white", 
    fontWeight: "bold" 
},
});
