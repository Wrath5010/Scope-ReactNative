import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: "#252525" },
        gestureDirection: "horizontal",
        animation: "fade_from_bottom",
        animationTypeForReplace: "push", // back pop uses slide
      }}
    />
  );
}
