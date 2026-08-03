import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#0D121C",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="presensi"
          options={{
            animation: "slide_from_right",
          }}
        />

        <Stack.Screen
          name="info"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  );
}