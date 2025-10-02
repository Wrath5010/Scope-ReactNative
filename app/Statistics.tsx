import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-gifted-charts";
import NavigationBar from "@/components/ui/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// === Types ===
interface Medicine {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
}

interface BarDataItem {
  value: number;
  label: string;
  frontColor: string;
  labelTextStyle?: { color: string; fontSize: number };
}

export default function Statistics() {
  const router = useRouter();
  const [barData, setBarData] = useState<BarDataItem[]>([]);

  const colors = ["#6a11cb", "#177AD5", "#ff7e5f", "#43cea2", "#f7971e", "#56ab2f"];

  //Adding space after abbreviation works as a gap between the bar and x axis(x is vertical), x styling dont work...
  const categoryAbbr: Record<string, string> = {
    "Antibiotics": "ABX ",
    "Painkillers": "Pain ",
    "Cough & Cold": "C&C ",
    "Allergy": "Allergy    ",
    "Vitamins & Supplements": "Vits ",
    "Digestive Health": "Digest    ",
    "Skin Care": "Skin ",
    "Cardiovascular": "CV",
    "Diabetes": "Diab",
  };

  useEffect(() => {
    //Fetching data
    const fetchMedicinesForChart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch("http://192.168.68.118:5000/api/medicines", { headers });
        const text = await response.text();

        let data: Medicine[];
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Failed to parse response as JSON: " + text);
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Aggregate quantities by category
        const categoryData = data.reduce((acc: Record<string, number>, item) => {
          acc[item.category] = (acc[item.category] || 0) + (item.stockQuantity ?? 0);
          return acc;
        }, {});

        // Map to chart format with abbreviations
        const chartData: BarDataItem[] = Object.entries(categoryData).map(([category, value], index) => ({
          value,
          label: categoryAbbr[category] ?? category,
          frontColor: colors[index % colors.length],
          labelTextStyle: { color: "#fff", fontSize: 11 },
        }));

        setBarData(chartData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Fetch medicines for chart error:", err.message);
          Alert.alert("Error", "Failed to fetch medicines for chart: " + err.message);
        } else {
          Alert.alert("Error", "An unknown error occurred while fetching medicines for chart.");
        }
      }
    };

    fetchMedicinesForChart();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text style={styles.title}>Inventory Statistics</Text>

        <View style={styles.barContainer}>
          <Text style={styles.chartTitle}>Stock by Categories</Text>
          <BarChart
            horizontal
            data={barData}
            barWidth={25}
            barBorderRadius={8}
            spacing={21}
            isAnimated
            animationDuration={800}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            showValuesAsTopLabel
            width={Dimensions.get("window").width * 0.6}
            height={barData.length * (30 + 15)}
            topLabelTextStyle={{
              color: "#fff",
              fontSize: 10,
              fontWeight: "600",
            }}
            yAxisTextStyle={{
              color: "#fff",
              fontSize: 12,
              fontWeight: "500",
            }}
          />
        </View>

        <View style={styles.box}>
            <View style={styles.boxsec}>

              <Pressable>
                <Image></Image>
                <Text>Total Stock Value:</Text>
              </Pressable>

              <Pressable>
                <Image></Image>
                <Text>Total Stock Value:</Text>
              </Pressable>

            </View>
            <View style={styles.boxsec}>

              <Pressable>
                <Image></Image>
                <Text>Total Stock Value:</Text>
              </Pressable>

              <Pressable>
                <Image></Image>
                <Text>Total Stock Value:</Text>
              </Pressable>

            </View>
        </View>

        <View style={styles.box}>
            <View style={styles.boxsec}>
              
              <View>
                <Text>Low Stock:</Text>
              </View>

              <View>
                <Text>Go to Inventory</Text>
              </View>
            </View>
            <View style={styles.boxsec}>

              <View>
                <Text>Expired:</Text>
              </View>

              <View>

              </View>

            </View>
        </View>


      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#252525",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 200, 
    backgroundColor: "#252525",
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 35,
    marginBottom: 20,
  },
  barContainer: {
    width: "90%",
    height: 550,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#252525",
    borderColor: "white",
    borderWidth: 2,
    marginTop: 15,
  },
  chartTitle: {
    fontSize: 16,
    color: "white",
    position: "absolute", 
    top: 25, 
    left: 20 
  },
  box: {
    height: 'auto',
    width: "90%",
    marginVertical: 20,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boxsec:{
    height: 150,
    width: '45%',
    backgroundColor: '#252525',
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12
  }
});
