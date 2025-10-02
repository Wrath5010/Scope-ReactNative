// app/index.tsx
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      router.replace("/StartUp"); // redirect only after mount
    }
  }, [mounted]);

  return <View />; // or some loading indicator
}
