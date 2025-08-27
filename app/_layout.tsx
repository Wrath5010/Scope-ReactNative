import { Stack } from "expo-router";
import { screenOptions } from "../components/headerLeft";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#252525" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {/* Root file is Startup once finished with everything */}
      
      <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="StartUp" options={{ headerShown: false }} />
      <Stack.Screen name="LoginPage" options={{ headerShown: false }} />
      <Stack.Screen name="AddMedicine" options={{headerShown: false}}/>
      <Stack.Screen name="InventoryPage" options={{ headerShown: false }} />
    </Stack>
  );
}
