import React, { useState } from "react";
import { View, Text, Platform, StyleSheet, Pressable } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
  expiryDate: Date | null;
  setExpiryDate: (date: Date) => void;
}

export default function DatePicker({ expiryDate, setExpiryDate }: DatePickerProps) {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setExpiryDate(selectedDate); // update parent
    }
    if (Platform.OS === "android") setShow(false); // auto-close picker on Android
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setShow(true)} style={styles.btn}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          {expiryDate
            ? `Selected date: ${expiryDate.toLocaleDateString()}`
            : "Select a date"} {/* Shows first */}
        </Text>
      </Pressable>

      {show && (
        <RNDateTimePicker
          value={expiryDate || new Date()} // picker defaults to today if null
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()} // prevent past dates
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '85%',
    gap: 20,
  },
  btn: {
    flex: 2,
    height: 50,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
