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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />

        <Stack.Screen
          name="register"
          options={{
            title: "Register",
            headerShown: false,
            headerStyle: { backgroundColor: "#3949AB" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "600" }
          }}
        />
      </Stack>

      {/* Toast גלובלי לכל האפליקציה */}
      <Toast />

      {/* Status bar */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
