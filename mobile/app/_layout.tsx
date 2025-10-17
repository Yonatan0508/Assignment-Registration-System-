import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* ✅ Stack יחיד עם הגדרה גלובלית */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen
          name="register"
          options={{
            title: "Register",
            headerStyle: { backgroundColor: "#3949AB" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "600" }
          }}
        />
      </Stack>

      <Toast />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
