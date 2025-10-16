import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-gifted-charts";
import NavigationBar from "@/components/ui/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { URL } from "./utils/api";

// === Types ===
interface Medicine {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  price?: number;
  expiryDate?: string;
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

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  

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
    const fetchMedicinesForChart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${URL}/medicines`, { headers });
        const text = await response.text();

        let data: Medicine[];
        try {
          data = JSON.parse(text);
          setMedicines(data);
        } catch {
          throw new Error("Failed to parse response as JSON: " + text);
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const categoryData = data.reduce((acc: Record<string, number>, item) => {
          acc[item.category] = (acc[item.category] || 0) + (item.stockQuantity ?? 0);
          return acc;
        }, {});

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
      } finally {
        setLoading(false);
      }
    };

    fetchMedicinesForChart();
  }, []);

  // === Summary Calculations ===
  const totalStockValue = medicines.reduce(
    (sum, med) => sum + (med.stockQuantity * (med.price || 0)),
    0
  );
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(med => med.stockQuantity <= 50).length;
  const expiredCount = medicines.filter(med => med.expiryDate && new Date(med.expiryDate) < new Date()).length;

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

        {/* === Summary Section === */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Image style={styles.icon} source={require('@/assets/images/total-value.png')}/>
            <Text style={styles.summaryLabel}>Total Stock Value</Text>
            <Text style={styles.summaryValue}>
              {loading ? "..." : `$${totalStockValue.toFixed(2)}`}
            </Text>
          </View>

          <Pressable style={styles.summaryBox} onPress={() => router.push('/InventoryPage')}>
            <Image style={styles.icon} source={require('@/assets/images/medicines.png')}/>
            <Text style={styles.summaryLabel}>Total Medicines</Text>
            <Text style={styles.summaryValue}>
              {loading ? "..." : totalMedicines}
            </Text>
            <Text style={styles.textlink}>Press to Inventory</Text>
          </Pressable>

          <Pressable style={styles.summaryBox} onPress={() => router.push({ pathname: "/InventoryPage", params: { filter: "lowStock" }})}>
            <Image style={styles.icon} source={require('@/assets/images/low-stock.png')}/>
            <Text style={styles.summaryLabel}>Low Stock</Text>
            <Text style={styles.summaryValue}>
              {loading ? "..." : lowStockCount}
            </Text>
            <Text style={styles.textlink}>Press to Check</Text>
          </Pressable>

          <Pressable style={styles.summaryBox} onPress={() => router.push({ pathname: "/InventoryPage", params: { filter: "expired" }})}>
            <Image style={styles.icon} source={require('@/assets/images/expired.png')}/>
            <Text style={styles.summaryLabel}>Expired</Text>
            <Text style={styles.summaryValue}>
              {loading ? "..." : expiredCount}
            </Text>
            <Text style={styles.textlink}>Press to Check</Text>
          </Pressable>
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
  summaryContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  width: "90%",
  marginVertical: 20,
  gap: 15,
},
summaryBox: {
  width: "47%", 
  backgroundColor: "#252525",
  borderRadius: 12,
  padding: 15,
  alignItems: "center",
  justifyContent: "center",
  borderColor: 'white',
  borderWidth: 2
},
icon: {
  width: 40,
  height: 40,
  marginBottom: 10,
},
summaryLabel: {
  color: "#fff",
  fontSize: 14,
  marginBottom: 5,
  textAlign: "center",
},
summaryValue: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
},
textlink:{
  color: "#00a6e8",
  fontWeight: "400",
  fontSize: 12
}

});
