import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const screenOptions = {
  headerLeft: () => {
    const router = useRouter();
    return (
      <Pressable onPress={() => router.back()} style={{ paddingLeft: 12 }}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>
    );
  },
};
