import { Background } from "@react-navigation/elements";
import { DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: { backgroundColor: "#252525" },
      }}
    >
      <Stack.Screen name="Dashboard"/>
      <Stack.Screen name="StartUp" />
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="AddMedicine" />
      <Stack.Screen name="Statistics" />
      <Stack.Screen name="InventoryPage" />
      <Stack.Screen name="Notification" />
      <Stack.Screen name="Activitylog" />
      <Stack.Screen name="DeletePage"/>
    </Stack>
  );
}
