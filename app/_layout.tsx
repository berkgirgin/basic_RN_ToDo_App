import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToDoLogicProvider } from "../context/todoLogicContext";
import { ThemeProvider } from "@/context/themeContext";
import { HeaderTitle } from "@react-navigation/elements";

export default function RootLayout() {
  return (
    <ToDoLogicProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="todos/[id]" />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </ToDoLogicProvider>
  );
}
